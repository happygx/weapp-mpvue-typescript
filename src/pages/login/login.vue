<template>
  <div class="login-wrap">
    <van-cell-group>
      <van-field
        label="用户名"
        placeholder="请输入用户名"
        clearable
        :value="username"
        @blur="onChange($event, 'username')"
      />
      <van-field
        label="密码"
        placeholder="请输入密码"
        clearable
        :password="passwordShow"
        :right-icon="passwordShow ? 'closed-eye' : 'eye-o'"
        :value="password"
        @blur="onChange($event, 'password')"
        @clickIcon="onClickIcon"
      />
    </van-cell-group>
    <div class="btn mt20">
      <van-button
        type="info"
        size="large"
        open-type="getUserInfo"
        @getuserinfo="bindGetUserInfo"
        >登录</van-button
      >
    </div>
  </div>
</template>

<script lang="ts" src="./login.ts"></script>

<style lang="scss" scoped>
@import './login.scss';
</style>
