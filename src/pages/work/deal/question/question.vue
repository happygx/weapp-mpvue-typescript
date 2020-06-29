<template>
  <div class="question-wrap">
    <van-cell-group :border="false">
      <van-field
        label="问题提出人"
        disabled
        title-width="80px"
        :border="false"
        :value="questionsData.exhibitor_name"
      />
      <van-cell title="问题分类" title-width="80px" :border="false">
        <p class="tl">{{ questionsData.classification_name }}</p>
      </van-cell>
      <van-cell title="问题级别" title-width="80px" :border="false">
        <p class="tl">
          {{ rankList[questionsData.rank] }}
        </p>
      </van-cell>
      <van-cell title="问题详情" title-width="80px" :border="false">
        <p class="fl tl">
          {{ questionsData.content }}
        </p>
      </van-cell>
      <van-cell
        :border="false"
        title="告警设备"
        title-width="80px"
        v-if="faultDevices.length > 0"
      >
        <van-tag
          v-for="(item, index) in faultDevices"
          :key="index"
          class="fl"
          plain
          size="medium"
          type="primary"
        >
          {{ item.location }}（{{ item.name }}）
        </van-tag>
      </van-cell>
      <van-cell
        v-if="!isView || devices.length > 0"
        :border="false"
        title="问题设备"
        title-width="80px"
      >
        <van-button
          v-if="!isView"
          type="info"
          size="small"
          class="fl"
          @click="addDevice"
        >
          添加设备
        </van-button>
        <template v-if="isView">
          <van-tag
            v-for="(item, index) in devices"
            :key="index"
            class="fl mr15"
            plain
            :closeable="false"
            size="medium"
            type="primary"
            @close="delDevice(index)"
          >
            {{ item.location }}
          </van-tag>
        </template>
      </van-cell>
      <van-cell
        v-if="devices.length > 0 && !isView"
        :border="false"
        title=" "
        title-width="80px"
      >
        <van-tag
          v-for="(item, index) in devices"
          :key="index"
          class="mr15 fl"
          plain
          :closeable="isView ? false : true"
          size="medium"
          type="primary"
          @close="delDevice(index)"
        >
          {{ item.location }}
        </van-tag>
      </van-cell>
      <van-popup position="bottom" :show="deviceShow" @close="deviceCancel">
        <van-picker
          id="devicePicker"
          show-toolbar
          title="请选择设备名称"
          value-key="location"
          :columns="deviceColumns"
          @change="deviceChange"
          @cancel="deviceCancel"
          @confirm="deviceConfirm"
        />
      </van-popup>
      <van-cell
        v-if="attachments.length > 0"
        :border="false"
        title="问题附件"
        title-width="80px"
        custom-class="uploader-hidden"
      >
        <van-uploader
          class="fl"
          preview-size="55px"
          :deletable="false"
          :file-list="attachments"
          @delete="handleRemove"
        />
      </van-cell>
      <van-popup :show="videoShow" @close="onVideoClose">
        <video :src="video.videoUrl" object-fit="cover" controls></video>
      </van-popup>
      <van-cell title="处理记录" title-width="80px" :border="false">
        <div class="record mb5" v-for="(item, i) in record" :key="i">
          <p class="tl">
            <span class="f14">{{ item.handler_time }}</span>
            <span class="ml10 fb">{{ item.handler_user_name }}：</span>
            <span style="word-break: break-all;">{{ item.suggest }}</span>
          </p>
          <span class="df" v-for="(attachment, j) in item.attachments" :key="j">
            <img
              mode="scaleToFill"
              :src="attachment.url || attachment.errUrl"
              class="img"
              style="width: 55px; height: 55px;"
              @error="imageError(i, j)"
              @click="onPreview(item.attachments, attachment)"
            />
          </span>
        </div>
      </van-cell>
      <van-cell
        v-if="!isView"
        :border="false"
        title="是否完成"
        title-width="80px"
      >
        <van-radio-group
          class="radio-group"
          :value="isFinish"
          @change="isFinish = $event.mp.detail"
        >
          <van-radio :name="20" class="mr20" icon-size="16px">是</van-radio>
          <van-radio :name="10" icon-size="16px">否</van-radio>
        </van-radio-group>
      </van-cell>
      <van-field
        v-if="textareaShow && !isView"
        label="处理结果"
        placeholder="请输入处理结果"
        autosize
        type="textarea"
        title-width="80px"
        :show-confirm-bar="false"
        :border="false"
        :value="suggest"
        @input="suggest = $event.mp.detail"
      />
      <!-- textarea的替代样式，为了解决textarea层级过高导致文字穿透浮层的问题 -->
      <van-cell
        v-if="!textareaShow"
        title="处理结果"
        title-width="80px"
        :border="false"
      >
        <p class="tl" :class="{ placeholder: suggest === '' }">
          {{ suggest === '' ? '请输入处理结果' : suggest }}
        </p>
      </van-cell>
      <van-cell
        v-if="!isView"
        :border="false"
        title="上传附件"
        title-width="80px"
      >
        <van-uploader
          class="fl"
          accept="media"
          preview-size="55px"
          max-count="5"
          :file-list="fileList"
          @afterRead="afterRead"
          @delete="handleRemove"
        />
      </van-cell>
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <div class="btn-group" v-if="!isView">
      <van-button size="large" @click="cancel">
        取消
      </van-button>
      <van-button
        style="margin-left: 10%;"
        type="info"
        size="large"
        @click="save"
      >
        保存
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./question.ts"></script>

<style lang="scss">
@import './question.scss';
</style>
