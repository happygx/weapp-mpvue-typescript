<template>
  <div class="mine-wrap">
    <header class="common-header">
      <Search
        v-if="componentShow"
        :searchOptions="searchOptions"
        @search="getWorkflows"
      />
      <Filter
        v-if="componentShow"
        :dropdownConfig="dropdownConfig"
        :timeConfig="timeConfig"
        @confirm="filterConfirm"
      />
    </header>
    <div class="common-content">
      <TableCom v-if="componentShow" :tableConfig="tableConfig" />
    </div>
    <van-dialog id="van-dialog" />
    <van-popup
      position="bottom"
      :show="distributeShow"
      @close="distributeShow = false"
    >
      <van-picker
        show-toolbar
        title="请选择分配人员"
        value-key="username"
        :columns="distributeData"
        @cancel="distributeShow = false"
        @confirm="distributeConfirm"
      />
    </van-popup>
  </div>
</template>

<script lang="ts" src="./mine.ts"></script>

<style lang="scss">
@import './mine.scss';
</style>
