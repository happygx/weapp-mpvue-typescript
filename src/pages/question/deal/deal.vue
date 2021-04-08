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
          {{ buildingRecord }}
          <van-icon
            v-if="roles === '售后经理'"
            name="edit"
            class="f16 ml5"
            custom-class="edit pr"
            @click="popupShow('recordShow')"
          />
        </p>
      </van-cell>
      <Popup
        v-if="recordShow && componentShow"
        title="注意事项"
        :content="buildingRecord"
        @cancel="popupShow('recordShow')"
        @confirm="recordConfirm"
      />
      <van-field label="仓库名称" disabled :border="false" :value="questionsData.building_name" />
      <van-field
        v-if="roles !== '养护员'"
        label="问题提出人"
        disabled
        :border="false"
        :value="questionsData.exhibitor_name"
      />
      <van-cell title="问题分类" title-width="90px" :border="false">
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
      <van-cell v-if="roles !== '养护员'" title="问题级别" title-width="90px" :border="false">
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
      <van-popup position="bottom" :show="rankShow" @close="popupShow('rankShow')">
        <van-picker
          show-toolbar
          title="请选择问题级别"
          value-key="name"
          :columns="rankList"
          @cancel="popupShow('rankShow')"
          @confirm="rankConfirm"
        />
      </van-popup>
      <van-cell :border="false" title="告警设备" title-width="90px" v-if="faultDevices.length > 0">
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
        title-width="90px"
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
        <template v-if="isView && devices.length > 0">
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
      <van-cell v-if="!isView && devices.length > 0" :border="false" title=" " title-width="90px">
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
          value-key="label"
          :columns="deviceColumns"
          @change="deviceChange"
          @cancel="deviceCancel"
          @confirm="deviceConfirm"
        />
      </van-popup>
      <van-cell title="问题详情" title-width="90px" :border="false">
        <span class="fl tl break">
          {{ questionsData.content }}
        </span>
      </van-cell>
      <van-cell v-if="attachments.length > 0" :border="false" title="问题附件" title-width="90px">
        <div class="tl mr10" v-for="(item, i) in attachments" :key="i">
          <p class="link" @click="onPreview(item)">{{ item.name }}</p>
        </div>
      </van-cell>
      <van-cell
        v-if="questionsData.workflow_code"
        title="问题工单"
        title-width="90px"
        :border="false"
      >
        <span class="df link" @click="work">
          {{ questionsData.workflow_code }}
        </span>
      </van-cell>
      <van-field
        v-if="!isView && textareaShow"
        label="处理意见"
        placeholder="请输入处理意见"
        autosize
        type="textarea"
        :show-confirm-bar="false"
        :border="false"
        :value="suggest"
        @input="suggest = $event.mp.detail"
      />
      <!-- textarea的替代样式，为了解决textarea层级过高导致文字穿透浮层的问题 -->
      <van-cell v-if="!isView && !textareaShow" title="处理意见" title-width="90px" :border="false">
        <p class="tl" :class="{ placeholder: suggest === '' }">
          {{ suggest === '' ? '请输入处理意见' : suggest }}
        </p>
      </van-cell>
      <van-cell
        v-if="roles !== '养护员' && record.length > 0"
        title="处理记录"
        title-width="90px"
        :border="false"
      >
        <div class="record mb5" v-for="(item, i) in record" :key="i">
          <p class="tl f12">
            <span>{{ item.handler_time }}</span>
            <span class="ml10 fb">{{ item.handler_user_name }}：</span>
            <span class="break">{{ item.suggest }}</span>
          </p>
          <div class="tl" v-for="(attachment, j) in item.attachments" :key="j">
            <p class="link mr10" @click="onPreview(attachment)">{{ attachment.name }}</p>
          </div>
        </div>
      </van-cell>
      <van-cell
        v-if="questionsData.result && roles === '养护员'"
        title="处理结果"
        title-width="90px"
        :border="false"
      >
        <div class="tl">
          <span>
            {{ questionsData.result }}
          </span>
        </div>
        <div class="tl mt10" v-if="record[0].attachments.length > 0">
          <p
            v-for="(attachment, i) in record[0].attachments"
            :key="i"
            class="link mr10"
            @click="onPreview(attachment)"
          >
            {{ attachment.name }}
          </p>
        </div>
      </van-cell>
      <van-popup :show="videoShow" @close="videoShow = false" custom-class="preview-popup">
        <video class="preview" :src="video.url" object-fit="cover" controls></video>
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
        成功
      </van-button>
      <van-button
        v-if="roles !== '售后经理'"
        style="margin-left: 10%;"
        type="info"
        size="large"
        @click="handleFailure"
      >
        流转
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./deal.ts"></script>

<style lang="scss">
@import './deal.scss';
</style>
