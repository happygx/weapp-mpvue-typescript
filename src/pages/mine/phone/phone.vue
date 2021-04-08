<!--
 * @Description:
 * @Author: happy
 * @Date: 2020-12-14 10:10:31
 * @LastEditTime: 2020-12-17 17:05:07
 * @LastEditors: happy
-->
<template>
  <div class="phone-wrap">
    <van-search
      custom-class="search"
      placeholder="请输入仓库名称"
      use-action-slot
      :value="search"
      @change="search = $event.mp.detail"
      @search="onSearch"
    >
      <p slot="action" @click="onSearch" class="search-btn">搜索</p>
    </van-search>
    <div style="margin-top: 50px;">
      <van-index-bar :index-list="indexList" :sticky="false" @select="select">
        <view v-for="(item, i) in customerList" :key="i">
          <van-index-anchor :index="item.province" :use-slot="true">
            <span class="fb">{{ item.province }}</span>
          </van-index-anchor>
          <van-cell v-for="(l, j) in item.list" :key="j" :title="l.name" @click="detail(l)" />
        </view>
      </van-index-bar>
    </div>
    <i class="iconfont icon-add" @click="addPerson"></i>
  </div>
</template>

<script lang="ts" src="./phone.ts"></script>

<style lang="scss">
@import './phone.scss';
</style>
