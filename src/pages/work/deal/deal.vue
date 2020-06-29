<template>
  <div class="deal-wrap">
    <van-cell-group :border="false">
      <van-field
        label="工单编号"
        disabled
        title-width="80px"
        :border="false"
        :value="workData.code"
      />
      <van-field
        label="仓库名称"
        disabled
        title-width="80px"
        :border="false"
        :value="workData.building_name"
      />
      <van-cell
        v-if="roles !== '养护员'"
        title="仓库记录"
        title-width="80px"
        :border="false"
      >
        <p class="tl">
          {{ workData.building_record }}
          <van-icon
            name="edit"
            class="f16 ml5"
            custom-class="edit pr"
            @click="recordShow = true"
          />
        </p>
      </van-cell>
      <Popup
        title="仓库记录"
        :show="recordShow"
        :content="workData.building_record"
        @cancel="recordShow = false"
        @confirm="recordConfirm"
      />
      <van-field
        label="创建人"
        disabled
        title-width="80px"
        :border="false"
        :value="workData.creator_name"
      />
      <van-field
        label="创建时间"
        disabled
        title-width="80px"
        :border="false"
        :value="workData.create_time"
      />
      <van-cell :border="false" title="工单问题" title-width="80px">
        <van-button
          v-if="!isView"
          type="info"
          size="small"
          class="fl"
          @click="addQuestion"
        >
          添加问题
        </van-button>
        <template v-else>
          <div
            class="mb5 question"
            v-for="(question, i) in workData.questions"
            :key="i"
          >
            <div class="df">
              <span
                class="iconfont icon-deal"
                :class="{ green: question.isFinish === 20 }"
              ></span>
              <span
                class="ml5 fb title"
                :class="rankClass[question.rank]"
                @click="dealQuestion(question, true)"
              >
                {{ question.classification_name }}
              </span>
            </div>
            <p class="tl">{{ question.content }}</p>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="!isView" :border="false" title=" " title-width="80px">
        <div
          class="mb5 question"
          v-for="(question, i) in workData.questions"
          :key="i"
        >
          <div class="df">
            <span
              class="iconfont icon-deal"
              :class="{ green: question.isFinish === 20 }"
            ></span>
            <span
              class="ml5 fb title"
              :class="rankClass[question.rank]"
              @click="dealQuestion(question)"
            >
              {{ question.classification_name }}
            </span>
          </div>
          <p class="tl">{{ question.content }}</p>
        </div>
      </van-cell>
      <van-cell :border="false" title="更换部件" title-width="80px">
        <van-button
          v-if="!isView"
          type="info"
          size="small"
          class="fl"
          @click="partModify()"
        >
          添加部件
        </van-button>
        <template v-else>
          <div
            class="mb10 question"
            v-for="(part, i) in workData.change_part"
            :key="i"
          >
            <div class="df">
              <span class="fb title">
                {{ part.device_location }}
              </span>
            </div>
            <p class="tl">
              <span>
                {{ part.part_kind }}/{{ part.part_name }}/{{
                  part.part_standard
                }}
              </span>
              <span class="ml10">{{ part.part_number }}</span>
            </p>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="!isView" :border="false" title=" " title-width="80px">
        <div
          class="mb10 question"
          v-for="(part, i) in workData.change_part"
          :key="i"
        >
          <div class="df">
            <span class="fb title">
              {{ part.device_location }}
            </span>
            <van-icon name="edit" class="f16 ml10" @click="partModify(part)" />
            <van-icon name="close" class="f16 ml10" @click="partDelete(i)" />
          </div>
          <p class="tl">
            <span>
              {{ part.part_kind }}/{{ part.part_name }}/{{ part.part_standard }}
            </span>
            <span class="ml10">{{ part.part_number }}</span>
          </p>
        </div>
      </van-cell>
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <div class="btn-group">
      <van-button v-if="!isView" type="info" size="large" @click="finish">
        处理完成
      </van-button>
      <van-button v-if="isConfirm" type="info" size="large" @click="confirm">
        确认完成
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./deal.ts"></script>

<style lang="scss">
@import './deal.scss';
</style>
