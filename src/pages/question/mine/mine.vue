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
      <TableCom v-if="componentShow" :tableConfig="tableConfig" />
    </div>
  </div>
</template>

<script lang="ts" src="./mine.ts"></script>

<style lang="scss">
@import './mine.scss';
</style>
