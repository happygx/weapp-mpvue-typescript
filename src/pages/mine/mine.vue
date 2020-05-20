<template>
  <div class="mine-wrap container">
    <div class="img mb20">
      <van-image
        use-error-slot
        round
        width="80px"
        height="80px"
        :src="info.avatar"
      >
        <van-icon slot="error" name="photo-o" size="30px" />
      </van-image>
    </div>
    <div class="mb30">
      <van-cell
        title="个人信息"
        is-link
        icon="contact"
        @click="route('information')"
      />
      <van-cell title="消息通知" is-link icon="comment-o" />
      <van-cell title="联系我们" is-link icon="phone-o" />
    </div>
    <div class="btn">
      <van-button v-if="info" type="info" size="large" @click="logout"
        >退出</van-button
      >
      <van-button v-else type="info" size="large" @click="login"
        >登录</van-button
      >
    </div>
  </div>
</template>

<script lang="ts" src="./mine.ts"></script>

<style lang="scss">
@import './mine.scss';
</style>
