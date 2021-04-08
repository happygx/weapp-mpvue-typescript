<!--
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2020-12-17 16:00:58
 * @LastEditors: happy
-->
<template>
  <div class="mine-wrap container">
    <div class="img mb10">
      <van-image use-error-slot round width="90px" height="90px" :src="info.avatar">
        <van-icon slot="error" name="photo-o" size="30px" />
      </van-image>
      <dir class="mt10 tac" v-if="info">
        <p class="fb f16">{{ info.name }}</p>
        <p class="f14 mt5">（{{ info.group }}）</p>
      </dir>
    </div>
    <div class="mb30">
      <van-cell
        v-if="info.group !== '养护员'"
        title="通讯录"
        is-link
        icon="friends-o"
        @click="route('phone')"
      />
      <van-cell title="个人信息" is-link icon="contact" @click="route('information')" />
      <!-- <van-cell
        title="消息通知"
        is-link
        icon="comment-o"
        @click="route('notice')"
      /> -->
      <van-cell title="联系我们" is-link icon="phone-o" @click="route('contact')" />
    </div>
    <div class="btn">
      <van-button v-if="info" type="info" size="large" @click="logout">退出</van-button>
      <van-button v-else type="info" size="large" @click="login">登录</van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import './index.scss';
</style>
