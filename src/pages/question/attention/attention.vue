<template>
  <div class="attention-wrap">
    <header class="common-header">
      <Search :searchOptions="searchOptions" @search="getQuestions" />
      <Filter
        :dropdownConfig="dropdownConfig"
        :timeConfig="timeConfig"
        @confirm="filterConfirm"
      />
    </header>
    <div class="common-content">
      <TableCom :tableConfig="tableConfig" />
    </div>
  </div>
</template>

<script lang="ts" src="./attention.ts"></script>

<style lang="scss">
@import './attention.scss';
</style>
