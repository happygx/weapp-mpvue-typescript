<template>
  <div class="deal-wrap">
    <van-cell-group :border="false">
      <van-field
        label="仓库名称"
        disabled
        title-width="80px"
        :border="false"
        :value="questionsData.building_name"
      />
      <van-cell
        v-if="roles !== '养护员'"
        title="仓库记录"
        title-width="80px"
        :border="false"
      >
        <p class="tl" style="word-break: break-all;">
          {{ questionsData.building_record }}
          <van-icon
            name="edit"
            class="f16 ml5"
            custom-class="edit pr"
            @click="popupShow('recordShow')"
          />
        </p>
      </van-cell>
      <Popup
        v-if="componentShow"
        title="仓库记录"
        :show="recordShow"
        :content="buildingRecord"
        @cancel="popupShow('recordShow')"
        @confirm="recordConfirm"
      />
      <van-field
        v-if="roles !== '养护员'"
        label="问题提出人"
        disabled
        title-width="80px"
        :border="false"
        :value="questionsData.exhibitor_name"
      />
      <van-cell title="问题分类" title-width="80px" :border="false">
        <span class="fl mr10">{{ questionsData.classification_name }}</span>
        <van-icon
          v-if="!isView"
          name="edit"
          class="fl f16"
          custom-class="edit"
          @click="popupShow('classificationShow')"
        />
      </van-cell>
      <van-popup
        position="bottom"
        :show="classificationShow"
        @close="popupShow('classificationShow')"
      >
        <van-picker
          show-toolbar
          title="请选择问题分类"
          value-key="name"
          :columns="classificationsData"
          @cancel="popupShow('classificationShow')"
          @confirm="classificationConfirm"
        />
      </van-popup>
      <van-cell
        v-if="roles !== '养护员'"
        title="问题级别"
        title-width="80px"
        :border="false"
      >
        <span class="fl mr10" v-if="questionsData.rank !== undefined">
          {{ rankList[questionsData.rank].name }}
        </span>
        <van-icon
          v-if="!isView"
          name="edit"
          class="fl f16"
          custom-class="edit"
          @click="popupShow('rankShow')"
        />
      </van-cell>
      <van-popup
        position="bottom"
        :show="rankShow"
        @close="popupShow('rankShow')"
      >
        <van-picker
          show-toolbar
          title="请选择问题级别"
          value-key="name"
          :columns="rankList"
          @cancel="popupShow('rankShow')"
          @confirm="rankConfirm"
        />
      </van-popup>
      <van-cell title="问题详情" title-width="80px" :border="false">
        <span class="fl tl">
          {{ questionsData.content }}
        </span>
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
          class="fl mr10 mb5"
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
          @click="popupShow('deviceShow')"
        >
          添加设备
        </van-button>
        <template v-if="isView">
          <van-tag
            v-for="(item, index) in devices"
            :key="index"
            class="fl mr10 mb5"
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
        v-if="!isView && devices.length > 0"
        :border="false"
        title=" "
        title-width="80px"
      >
        <van-tag
          v-for="(item, index) in devices"
          :key="index"
          class="fl mr10 mb5"
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
      >
        <van-uploader
          class="fl"
          preview-size="55px"
          :deletable="false"
          :file-list="attachments"
          @delete="handleRemove"
        />
      </van-cell>
      <van-field
        v-if="!isView && textareaShow"
        label="处理意见"
        placeholder="请输入处理意见"
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
        v-if="!isView && !textareaShow"
        title="处理意见"
        title-width="80px"
        :border="false"
      >
        <span class="fl tl" :class="{ placeholder: suggest === '' }">
          {{ suggest === '' ? '请输入处理意见' : suggest }}
        </span>
      </van-cell>
      <van-cell
        v-if="roles !== '养护员' && record.length > 0"
        title="处理记录"
        title-width="80px"
        :border="false"
      >
        <p class="clearfix tl mb10" v-for="(item, i) in record" :key="i">
          {{ item.handler_time }}
          <span class="ml10 fb">{{ item.handler_user_name }}：</span>
          {{ item.suggest }}
        </p>
        <p class="df mt10">
          <img
            v-for="(attachment, j) in item.attachments"
            :key="j"
            mode="scaleToFill"
            :src="attachment.url || attachment.errUrl"
            class="fl img"
            style="width: 55px; height: 55px;"
            @error="imageError(attachment)"
            @click="onPreview(attachment)"
          />
        </p>
      </van-cell>
      <van-cell
        v-if="questionsData.result"
        title="处理结果"
        title-width="80px"
        :border="false"
      >
        <div class="df">
          <span>
            {{ questionsData.result }}
          </span>
          <span v-if="record[0].workflow_id" class="ml20 link" @click="work">
            工单
          </span>
        </div>
        <div class="df mt10">
          <img
            v-for="(attachment, j) in record[0].attachments"
            :key="j"
            mode="scaleToFill"
            :src="attachment.url || attachment.errUrl"
            class="img"
            style="width: 55px; height: 55px;"
            @error="imageError(attachment)"
            @click="onPreview(attachment)"
          />
        </div>
      </van-cell>
      <van-popup :show="videoShow" @close="onVideoClose" custom-class="popup">
        <video
          class="preview"
          :src="video.videoUrl"
          object-fit="cover"
          controls
        ></video>
      </van-popup>
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <div class="btn-group" v-if="!isView">
      <van-button
        type="info"
        size="large"
        :custom-class="roles === '售后经理' ? 'w100' : ''"
        @click="handleSuccess"
      >
        处理成功
      </van-button>
      <van-button
        v-if="roles !== '售后经理'"
        style="margin-left: 10%;"
        type="info"
        size="large"
        @click="handleFailure"
      >
        处理失败
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./deal.ts"></script>

<style lang="scss">
@import './deal.scss';
</style>
