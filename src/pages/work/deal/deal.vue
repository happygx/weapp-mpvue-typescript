<template>
  <div class="deal-wrap">
    <van-cell-group :border="false">
      <van-cell
        v-if="roles !== '养护员'"
        title="注意事项"
        title-class="red"
        title-width="90px"
        :border="false"
      >
        <p class="tl break">
          {{ workData.building_record }}
          <van-icon
            v-if="roles === '售后经理'"
            name="edit"
            class="f16 ml5"
            custom-class="edit pr"
            @click="recordShow = true"
          />
        </p>
      </van-cell>
      <Popup
        v-if="recordShow && componentShow"
        title="注意事项"
        :content="workData.building_record"
        @cancel="recordShow = false"
        @confirm="recordConfirm"
      />
      <van-field label="仓库名称" disabled :border="false" :value="workData.building_name" />
      <van-field
        label="工单编号"
        disabled
        title-class="title"
        :border="false"
        :value="workData.code"
      />
      <van-field label="工单类型" disabled :border="false" :value="kindList[workData.kind]" />
      <van-field label="创建人" disabled :border="false" :value="workData.creator_name" />
      <van-field label="创建时间" disabled :border="false" :value="workData.create_time" />
      <van-field
        v-if="workData.handler_user_name"
        label="处理人"
        disabled
        :border="false"
        :value="workData.handler_user_name"
      />
      <van-cell :border="false" title="工单问题" title-width="90px" v-if="questions.length > 0">
        <van-button
          v-if="!isView && workData.status === 20"
          type="info"
          size="small"
          class="fl"
          @click="addQuestion"
        >
          添加问题
        </van-button>
        <template v-else>
          <div class="mb5 question" v-for="(question, i) in questions" :key="i">
            <div class="df">
              <i
                :class="[
                  'iconfont',
                  question.isFinish === 10 ? 'icon-error red' : 'icon-deal green'
                ]"
              ></i>
              <p
                class="tl link ml5"
                :class="rankClass[question.rank]"
                @click="dealQuestion(question, true)"
              >
                {{ question.classification_name }}
              </p>
            </div>
            <p class="tl break">详情：{{ question.content }}</p>
            <p class="tl break" v-if="question.isFinish === 20">结果：{{ question.result }}</p>
          </div>
        </template>
      </van-cell>
      <van-cell
        v-if="!isView && questions.length > 0 && workData.status === 20"
        :border="false"
        title=" "
        title-width="90px"
      >
        <div class="mb5 question" v-for="(question, i) in questions" :key="i">
          <div class="df">
            <span class="iconfont icon-deal" :class="{ green: question.isFinish === 20 }"></span>
            <span class="ml5 fb title" :class="rankClass[question.rank]">
              {{ question.classification_name }}
            </span>
            <van-icon
              v-if="question.record.length > 0 && question.record[0].revisable"
              name="edit"
              class="f16 ml10"
              @click="dealQuestion(question)"
            />
            <van-icon v-else name="add-o" class="f16 ml10" @click="dealQuestion(question)" />
          </div>
          <p class="tl">{{ question.content }}</p>
        </div>
      </van-cell>
      <van-cell v-if="isPart" :border="false" title="部件清单" title-width="90px">
        <van-button
          v-if="!isView && !isConfirm"
          type="info"
          size="small"
          class="fl"
          @click="partModify()"
        >
          添加部件
        </van-button>
        <template v-else>
          <div class="mb10 question" v-for="(part, i) in parts" :key="i">
            <div class="df">
              <span class="fb title">
                {{ part.device_location }}
              </span>
            </div>
            <p class="tl">
              <span class="fb">{{ part.is_renewal ? '更换' : '维修' }}</span>
              <span class="ml10">
                {{ part.part_kind }}/{{ part.part_name }}/{{ part.part_standard }}
              </span>
              <span v-if="part.content">({{ part.content }})</span>
              <span class="ml10">{{ part.part_number }}</span>
            </p>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="workData.kind === 40" :border="false" title="调试文档" title-width="90px">
        <template v-if="!isView">
          <div class="mb15 tl">
            <p v-for="(item, i) in sampleFiles" :key="i">
              <a class="link" @click="downloadFile(item.url)">{{ item.name }}</a>
            </p>
          </div>
        </template>
      </van-cell>
      <van-cell
        v-if="!isView && !isConfirm && parts.length > 0"
        :border="false"
        title=" "
        title-width="90px"
      >
        <div class="mb10 question" v-for="(part, i) in parts" :key="i">
          <div class="df">
            <span class="fb title">
              {{ part.device_location }}
            </span>
            <van-icon name="edit" class="f18 ml10" @click="partModify(part)" />
            <van-icon name="close" class="f18 ml15" @click="partDelete(i)" />
          </div>
          <p class="tl">
            <span class="fb">{{ part.is_renewal ? '更换' : '维修' }}</span>
            <span class="ml10">
              {{ part.part_kind }}/{{ part.part_name }}/{{ part.part_standard }}
            </span>
            <span v-if="part.content">({{ part.content }})</span>
            <span class="ml10">{{ part.part_number }}</span>
          </p>
        </div>
      </van-cell>
      <van-cell v-if="workData.kind === 20" :border="false" title="保养表" title-width="90px">
        <p class="link tl" @click="maintenance">
          {{ isView || isConfirm ? '详情' : '填写' }}
        </p>
      </van-cell>
      <van-cell title="工单记录" title-width="90px" :border="false">
        <div class="record mb5 break tl f12" v-for="(item, i) in workData.operations" :key="i">
          <p>{{ item.handler_time }}</p>
          <span class="fb">{{ item.handler_user_name }}</span>
          <span
            v-if="item.handler_user_phone"
            class="link"
            @click="callPhone(item.handler_user_phone)"
            >（{{ item.handler_user_phone }}）</span
          >
          <span>
            ：{{ item.kind_text }}{{ item.status === 20 ? item.receive_user_name : '' }}
          </span>
          <span class="break"></span>
        </div>
      </van-cell>
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <div class="btn-group">
      <van-button v-if="!isView && !isConfirm" type="info" size="large" @click="finish">
        提交
      </van-button>
      <van-button v-if="isConfirm" type="info" size="large" @click="confirm">
        确认
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./deal.ts"></script>

<style lang="scss">
@import './deal.scss';
</style>
