<template>
  <div class="device-wrap">
    <van-cell-group :border="false">
      <van-field
        label="设备名称"
        placeholder="请选择设备名称"
        disabled
        title-width="80px"
        :border="false"
        :value="deviceName"
        @click="deviceShow = true"
      />
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
      <van-field
        label="部件名称"
        placeholder="请选择部件名称"
        disabled
        title-width="80px"
        :border="false"
        :value="partStandardName"
        @click="standardShow = true"
      />
      <van-popup position="bottom" :show="standardShow" @close="standardCancel">
        <van-picker
          id="standardPicker"
          show-toolbar
          title="请选择设备名称"
          value-key="label"
          :columns="standardColumns"
          @change="standardChange"
          @cancel="standardCancel"
          @confirm="standardConfirm"
        />
      </van-popup>
      <van-cell title="部件数量" title-width="80px" :border="false">
        <van-stepper class="fl" :value="partNumber" @change="stepChange" />
      </van-cell>
    </van-cell-group>
    <div class="btn-group">
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

<script lang="ts" src="./device.ts"></script>

<style lang="scss">
@import './device.scss';
</style>
