<!--
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-03-16 15:49:37
 * @LastEditors: happy
-->
<template>
  <div class="device-wrap">
    <van-cell-group :border="false">
      <van-cell :border="false" title="维修类型" title-width="90px">
        <van-radio-group class="df" :value="maintainType" @change="maintainType = $event.mp.detail">
          <van-radio :name="0" class="mr15" icon-size="16px">维修</van-radio>
          <van-radio :name="1" class="mr15" icon-size="16px">更换</van-radio>
        </van-radio-group>
      </van-cell>
      <van-field
        label="设备名称"
        placeholder="请选择设备名称"
        disabled
        :border="false"
        :value="deviceName"
        @click="deviceShow = true"
      />
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
      <van-field
        label="部件名称"
        placeholder="请选择部件名称"
        disabled
        :border="false"
        :value="partStandardName"
        @click="standardShow = true"
      />
      <van-popup position="bottom" :show="standardShow" @close="standardCancel">
        <van-picker
          id="standardPicker"
          show-toolbar
          title="请选择部件名称"
          value-key="label"
          :columns="standardColumns"
          @change="standardChange"
          @cancel="standardCancel"
          @confirm="standardConfirm"
        />
      </van-popup>
      <van-field
        v-if="remarksShow"
        label="部件备注"
        placeholder="请填写部件备注"
        :border="false"
        :value="content"
        @input="content = $event.mp.detail"
      />
      <van-cell title="部件数量" :border="false" title-width="90px">
        <van-stepper class="fl" :value="partNumber" @change="stepChange" />
      </van-cell>
    </van-cell-group>
    <div class="btn-group">
      <van-button type="info" size="large" @click="save">
        保存
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./device.ts"></script>

<style lang="scss">
@import './device.scss';
</style>
