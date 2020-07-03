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
        <p class="tl" style="word-break: break-all;">
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
        v-if="componentShow"
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
      <van-cell
        :border="false"
        title="工单问题"
        title-width="80px"
        v-if="questions.length > 0"
      >
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
          <div class="mb5 question" v-for="(question, i) in questions" :key="i">
            <p
              class="tl fb title"
              :class="rankClass[question.rank]"
              @click="dealQuestion(question, true)"
            >
              {{ question.classification_name }}
            </p>
            <p class="tl">{{ question.content }}</p>
            <p class="df mt10">
              <img
                v-for="(attachment, j) in question.record[0].attachments"
                :key="j"
                mode="scaleToFill"
                :src="attachment.errUrl || attachment.url"
                class="img"
                style="width: 55px; height: 55px;"
                @error="imageError(attachment)"
                @click="onPreview(attachment)"
              />
            </p>
          </div>
        </template>
      </van-cell>
      <van-popup
        :show="previewShow"
        @close="onPreviewClose"
        custom-class="preview-popup"
      >
        <video
          v-if="preview.isVideo"
          class="preview"
          :src="preview.url"
          object-fit="cover"
          controls
        ></video>
        <img v-else class="preview" :src="preview.url" mode="scaleToFill" />
      </van-popup>
      <van-cell
        v-if="!isView && questions.length > 0"
        :border="false"
        title=" "
        title-width="80px"
      >
        <div class="mb5 question" v-for="(question, i) in questions" :key="i">
          <div class="df">
            <span
              class="iconfont icon-deal"
              :class="{ green: question.isFinish === 20 }"
            ></span>
            <span class="ml5 fb title" :class="rankClass[question.rank]">
              {{ question.classification_name }}
            </span>
            <van-icon
              v-if="question.record.length > 0 && question.record[0].revisable"
              name="edit"
              class="f16 ml10"
              @click="dealQuestion(question)"
            />
            <van-icon
              v-else
              name="add-o"
              class="f16 ml10"
              @click="dealQuestion(question)"
            />
          </div>
          <p class="tl">{{ question.content }}</p>
        </div>
      </van-cell>
      <van-cell :border="false" title="更换部件" title-width="80px">
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
      <van-cell
        v-if="!isView && !isConfirm && parts.length > 0"
        :border="false"
        title=" "
        title-width="80px"
      >
        <div class="mb10 question" v-for="(part, i) in parts" :key="i">
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
      <van-cell
        v-if="workData.kind === 20"
        :border="false"
        title="保养表"
        title-width="80px"
      >
        <p class="link tl" @click="maintenance">
          {{ isConfirm ? '详情' : '填写' }}
        </p>
      </van-cell>
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <div class="btn-group">
      <van-button
        v-if="!isView && !isConfirm"
        type="info"
        size="large"
        @click="finish"
      >
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
