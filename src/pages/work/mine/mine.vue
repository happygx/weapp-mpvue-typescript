<!--
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-03-11 10:10:57
 * @LastEditors: happy
-->
<template>
  <div class="mine-wrap">
    <header class="common-header">
      <Search v-if="componentShow" :searchOptions="searchOptions" @search="generateData" />
      <Filter
        v-if="componentShow"
        :dropdownConfig="dropdownConfig"
        :timeConfig="timeConfig"
        @filter="generateData"
      />
    </header>
    <div class="common-content">
      <TableCom v-if="componentShow" :tableConfig="tableConfig" ref="table" />
    </div>
    <van-popup position="bottom" :show="distributeShow" @close="distributeShow = false">
      <van-picker
        show-toolbar
        title="请选择分配人员"
        value-key="username"
        :columns="distributePersonnelData"
        @cancel="distributeShow = false"
        @confirm="distributeConfirm"
      />
    </van-popup>
    <van-dialog id="van-dialog" />
    <footer class="footer df" v-if="isFooter">
      <van-checkbox custom-class="mr30" :value="checked" @change="checkedAll">全选</van-checkbox>
      <van-button custom-class="footer-btn" round type="info" @click="distributeAll">
        分配工单
      </van-button>
    </footer>
  </div>
</template>

<script lang="ts" src="./mine.ts"></script>

<style lang="scss">
@import './mine.scss';
</style>
