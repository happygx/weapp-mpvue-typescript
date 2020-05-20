<template>
  <div class="login-wrap">
    <van-cell-group>
      <van-field
        label="用户名"
        placeholder="请输入用户名"
        :value="form.username"
        @input="form.username = $event.mp.detail"
      />
      <van-field
        label="密码"
        placeholder="请输入密码"
        :value="form.password"
        :password="passwordShow"
        :right-icon="passwordShow ? 'closed-eye' : 'eye-o'"
        @input="form.password = $event.mp.detail"
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
    <!--这种特殊占位符是必须有的！-->
    <van-toast id="van-toast" />
  </div>
</template>

<script lang="ts" src="./login.ts"></script>

<style lang="scss" scoped>
@import './login.scss';
</style>
