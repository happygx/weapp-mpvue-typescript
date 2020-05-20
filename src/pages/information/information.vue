<template>
  <div class="information-wrap">
    <van-cell title="用户名" :value="info.username" />
    <van-cell title="姓名" :value="info.name" is-link />
    <van-cell title="性别" :value="info.gender" is-link />
    <van-cell title="手机号" :value="info.phone" is-link />
  </div>
</template>

<script lang="ts" src="./information.ts"></script>

<style lang="scss" scoped>
@import './information.scss';
</style>
