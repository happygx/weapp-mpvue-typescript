<template>
  <div class="company-wrap">
    <van-popup show="true" duration="0" custom-class="company-popup">
      <van-search
        placeholder="请输入仓库名称"
        background="#f7f8fa"
        custom-class="search"
        cancel-class="cancel"
        show-action
        @change="onChange"
        @cancel="onCancel"
      >
      </van-search>
      <van-cell-group custom-class="building-list">
        <van-cell
          v-for="(item, index) in buildings"
          :key="index"
          :title="item.name"
          @click="onSelect(item)"
        />
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script lang="ts" src="./company.ts"></script>

<style lang="scss">
@import './company.scss';
</style>
