<!--
 * @Description:
 * @Author: happy
 * @Date: 2020-12-17 15:29:19
 * @LastEditTime: 2021-04-01 17:07:56
 * @LastEditors: happy
-->
<template>
  <div class="detail-wrap">
    <van-dialog id="van-dialog" />
    <van-cell-group custom-class="list-wrap" :border="false">
      <van-cell custom-class="list-item" v-for="(item, i) in personData" :key="i" :border="false">
        <div class="df">
          <span class="fb f16 list-title">{{ item.name }}</span>
          <i class="iconfont icon-edit ml15" @click="editPerson(item.id)"></i>
          <i class="iconfont icon-delete ml15" @click="deletePerson(item.id)"></i>
        </div>
        <div class="list-content mt10">
          <span class="fl">
            <i class="iconfont icon-position"></i>
            <span class="ml5">{{ item.kind_name }}</span>
          </span>
          <span class="fl ml30">
            <i class="iconfont icon-phone"></i>
            <span class="ml5" @click="call(item.mobile)">{{ item.mobile }}</span>
          </span>
        </div>
      </van-cell>
    </van-cell-group>
    <div class="mt10 f14 address" v-if="personData.length > 0">
      <i class="iconfont icon-region"></i>
      <span class="ml5" @click="toMapApp">地址：{{ buildingAddress }}</span>
      <span class="link ml10" @click="updateAddress()">更新</span>
    </div>
    <van-button type="info" size="large" custom-class="mt30" @click="addPerson">新增</van-button>
  </div>
</template>

<script lang="ts" src="./detail.ts"></script>

<style lang="scss">
@import './detail.scss';
</style>
