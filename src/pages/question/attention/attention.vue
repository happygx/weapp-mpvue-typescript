<template>
  <div class="attention-wrap">
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
      <TableCom v-if="componentShow" :tableConfig="tableConfig" />
    </div>
  </div>
</template>

<script lang="ts" src="./attention.ts"></script>

<style lang="scss">
@import './attention.scss';
</style>
