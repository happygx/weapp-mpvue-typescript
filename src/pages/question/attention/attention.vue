<!--
 * @Description:
 * @Author: happygx
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2020-11-24 13:20:51
 * @LastEditors: happygx
-->
<template>
  <div class="attention-wrap">
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

<script lang="ts" src="./attention.ts"></script>

<style lang="scss">
@import './attention.scss';
</style>
