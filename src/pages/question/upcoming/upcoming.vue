<template>
  <div class="upcoming-wrap">
    <header class="common-header">
      <Search v-if="componentShow" :searchOptions="searchOptions" @search="getQuestions" />
      <Filter v-if="componentShow" :dropdownConfig="dropdownConfig" :timeConfig="timeConfig" @confirm="filterConfirm" />
    </header>
    <div class="common-content">
      <TableCom ref="table" :tableConfig="tableConfig" />
    </div>
    <Popup v-if="closeShow && componentShow" title="关闭说明" @cancel="closeShow = false" @confirm="closeConfirm" />
    <footer class="df">
      <van-checkbox custom-class="mr30" :value="checked" @change="checkedAll">全选</van-checkbox>
      <van-button custom-class="footer-btn" round type="info" @click="createWork">创建工单</van-button>
    </footer>
  </div>
</template>

<script lang="ts" src="./upcoming.ts"></script>

<style lang="scss">
@import './upcoming.scss';
</style>
