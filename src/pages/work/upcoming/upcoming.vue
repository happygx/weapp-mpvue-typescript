<template>
  <div class="upcoming-wrap">
    <header class="common-header">
      <Search v-if="componentShow" :searchOptions="searchOptions" @search="getWorkflows" />
      <Filter v-if="componentShow" :dropdownConfig="dropdownConfig" :timeConfig="timeConfig" @confirm="filterConfirm" />
    </header>
    <div class="common-content">
      <TableCom v-if="componentShow" :tableConfig="tableConfig" />
    </div>
    <van-popup position="bottom" :show="distributeShow" @close="distributeShow = false">
      <van-picker
        show-toolbar
        title="请选择分配人员"
        value-key="username"
        :columns="distributeData"
        @cancel="distributeShow = false"
        @confirm="distributeConfirm"
      />
    </van-popup>
    <van-dialog id="van-dialog" />
  </div>
</template>

<script lang="ts" src="./upcoming.ts"></script>

<style lang="scss">
@import './upcoming.scss';
</style>
