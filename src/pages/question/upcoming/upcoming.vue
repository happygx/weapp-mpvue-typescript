<template>
  <div class="upcoming-wrap">
    <header class="common-header">
      <Search
        v-if="componentShow"
        :searchOptions="searchOptions"
        @search="getQuestions"
      />
      <Filter
        v-if="componentShow"
        :dropdownConfig="dropdownConfig"
        :timeConfig="timeConfig"
        @confirm="filterConfirm"
      />
    </header>
    <div class="common-content">
      <TableCom :tableConfig="tableConfig" />
    </div>
    <Popup
      v-if="componentShow"
      :show="closeShow"
      title="关闭说明"
      @cancel="closeShow = false"
      @confirm="closeConfirm"
    />
  </div>
</template>

<script lang="ts" src="./upcoming.ts"></script>

<style lang="scss">
@import './upcoming.scss';
</style>
