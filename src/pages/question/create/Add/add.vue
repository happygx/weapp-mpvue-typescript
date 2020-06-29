<template>
  <div class="add-wrap">
    <van-cell-group :border="false">
      <van-field
        label="仓库名称"
        required
        disabled
        :border="false"
        :value="buildingName"
        @click="!disabled && (companyShow = true)"
      />
      <Company
        v-if="companyShow"
        :buildingsData="buildingsData"
        @onCancel="companyShow = false"
        @onSelect="selectBuilding"
      />
      <van-field
        v-if="roles !== '养护员'"
        label="问题提出人"
        placeholder="请选择问题提出人"
        required
        disabled
        :border="false"
        :value="exhibitorName"
        @click="exhibitorShow = true"
      />
      <van-popup
        position="bottom"
        :show="exhibitorShow"
        @close="exhibitorShow = false"
      >
        <van-picker
          show-toolbar
          title="请选择问题提出人"
          value-key="username"
          :columns="exhibitorData"
          @cancel="exhibitorShow = false"
          @confirm="exhibitorConfirm"
        />
      </van-popup>
      <van-field
        label="问题分类"
        placeholder="请选择问题分类"
        required
        disabled
        :border="false"
        :value="classificationName"
        @click="classificationShow = true"
      />
      <van-popup
        position="bottom"
        :show="classificationShow"
        @close="classificationShow = false"
      >
        <van-picker
          show-toolbar
          title="请选择问题分类"
          value-key="name"
          :columns="classificationsData"
          @cancel="classificationShow = false"
          @confirm="classificationConfirm"
        />
      </van-popup>
      <van-cell
        v-if="roles !== '养护员'"
        :border="false"
        title="问题级别"
        title-width="90px"
        title-class="required"
      >
        <van-radio-group
          class="radio-group"
          :value="form.rank"
          @change="form.rank = $event.mp.detail"
        >
          <van-radio :name="0" class="mr15" icon-size="16px">一般</van-radio>
          <van-radio :name="1" class="mr15" icon-size="16px">紧急</van-radio>
          <van-radio :name="2" icon-size="16px">非常紧急</van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell
        v-if="roles !== '养护员'"
        :border="false"
        title="远程处理"
        title-width="90px"
        title-class="required"
      >
        <van-radio-group
          class="radio-group"
          :value="form.status"
          @change="form.status = $event.mp.detail"
        >
          <van-radio :name="10" class="mr20" icon-size="16px">是</van-radio>
          <van-radio :name="20" icon-size="16px">否</van-radio>
        </van-radio-group>
      </van-cell>
      <van-field
        v-if="!companyShow"
        label="问题详情"
        placeholder="请输入问题详情"
        required
        autosize
        type="textarea"
        :show-confirm-bar="false"
        :border="false"
        :value="form.content"
        @input="form.content = $event.mp.detail"
      />
      <van-cell
        :border="false"
        title="告警设备"
        title-width="90px"
        v-if="faultDevice.length > 0"
      >
        <van-tag
          v-for="(item, index) in faultDevice"
          :key="index"
          class="fl"
          plain
          size="medium"
          type="primary"
        >
          {{ item.location }}（{{ item.name }}）
        </van-tag>
      </van-cell>
      <van-cell :border="false" title="问题设备" title-width="90px">
        <van-button
          type="info"
          size="small"
          class="fl"
          @click="deviceShow = true"
        >
          添加设备
        </van-button>
      </van-cell>
      <van-cell
        v-if="form.devices.length > 0"
        :border="false"
        title=" "
        title-width="90px"
      >
        <van-tag
          v-for="(item, index) in form.devices"
          :key="index"
          class="fl mr15"
          plain
          closeable
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
      <van-cell :border="false" title="上传附件" title-width="90px">
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
    <van-button type="info" size="large" custom-class="mt20" @click="submit">
      立即创建
    </van-button>
  </div>
</template>

<script lang="ts" src="./add.ts"></script>

<style lang="scss">
@import './add.scss';
</style>
