<template>
  <div class="search-wrap clearfix">
    <van-search
      custom-class="select"
      input-class="input"
      :value="searchRow.text"
      use-left-icon-slot
      right-icon="arrow-down"
      disabled
      @click="onSelect"
    />
    <van-search
      custom-class="search"
      placeholder="请输入搜索关键词"
      use-action-slot
      @change="searchVal = $event.mp.detail"
      @search="onSearch"
    >
      <p slot="action" @click="onSearch" class="search-btn">搜索</p>
    </van-search>
    <van-popup position="bottom" :show="searchShow" @close="pickerCancel">
      <van-picker
        show-toolbar
        title="请选择搜索信息"
        :columns="searchOptions"
        @cancel="pickerCancel"
        @confirm="pickerConfirm"
      />
    </van-popup>
  </div>
</template>

<script lang="ts" src="./search.ts"></script>

<style lang="scss">
@import './search.scss';
</style>
