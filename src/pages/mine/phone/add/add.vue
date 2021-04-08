<!--
 * @Description:
 * @Author: happy
 * @Date: 2020-12-15 11:29:31
 * @LastEditTime: 2021-04-01 17:21:27
 * @LastEditors: happy
-->
<template>
  <div class="add-wrap">
    <van-cell-group :border="false" custom-class="cell-group">
      <van-field
        label="仓库名称"
        placeholder="请选择仓库名称"
        disabled
        :border="false"
        :value="buildingName"
      />
      <van-field
        label="姓名"
        placeholder="请输入姓名"
        :value="name"
        :border="false"
        @change="name = $event.mp.detail"
      />
      <van-field
        type="number"
        label="电话号码"
        placeholder="请输入电话号码"
        :value="mobile"
        :border="false"
        @change="mobile = $event.mp.detail"
      />
      <van-cell :border="false" title="公司职位" title-width="90px">
        <van-radio-group class="radio-group" :value="kind" @change="kind = $event.mp.detail">
          <van-radio :name="10" class="mr15" icon-size="16px">养护员</van-radio>
          <van-radio :name="20" class="mr15" icon-size="16px">设备管理员</van-radio>
          <van-radio :name="30" icon-size="16px">经理</van-radio>
        </van-radio-group>
      </van-cell>
    </van-cell-group>
    <div class="mt20">
      <van-button type="info" size="large" @click="onSubmit">
        保存
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./add.ts"></script>

<style lang="scss">
@import './add.scss';
</style>
