<template>
  <div class="index-warp">
    <swiper
      catchtap="onSwiperTap"
      indicator-active-color="rgba(255,255,255,.7)"
      indicator-dots="true"
      autoplay="true"
      interval="5000"
      class="swiper"
    >
      <swiper-item>
        <image :src="bg1"></image>
      </swiper-item>
      <swiper-item>
        <image :src="bg2"></image>
      </swiper-item>
    </swiper>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped>
@import './index.scss';
</style>
