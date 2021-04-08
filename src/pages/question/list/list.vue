<!--
 * @Description:
 * @Author: happygx
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2020-11-24 13:37:46
 * @LastEditors: happygx
-->
<template>
  <div class="list-wrap">
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

<script lang="ts" src="./list.ts"></script>

<style lang="scss">
@import './list.scss';
</style>
