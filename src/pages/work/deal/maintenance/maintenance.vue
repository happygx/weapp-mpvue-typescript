<template>
  <div class="maintenance-wrap">
    <van-checkbox
      v-if="!disabled"
      custom-class="mb10"
      label-class="label fb"
      shape="square"
      icon-size="15px"
      :value="isAll"
      @change="checkAll"
      >全选</van-checkbox
    >
    <van-checkbox
      v-for="(item, i) in maintenanceData"
      :key="i"
      custom-class="mb10"
      label-class="label"
      shape="square"
      icon-size="15px"
      :disabled="disabled"
      :value="item.status"
      @change="item.status = $event.mp.detail"
      >{{ item.item }}</van-checkbox
    >
    <div class="btn-group" v-if="!disabled">
      <van-button type="info" size="large" @click="onSubmit">
        保存
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./maintenance.ts"></script>

<style lang="scss">
@import './maintenance.scss';
</style>
