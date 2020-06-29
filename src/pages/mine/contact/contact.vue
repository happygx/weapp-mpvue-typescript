<template>
  <div class="contact-wrap">
    <img :src="banner" class="banner" />
    <div class="detail">
      <h3 class="detail-title fb mb5">地址 l Address</h3>
      <p>浙江：浙江省杭州市西湖区玉皇山路阔石板52号</p>
      <p>湖南：湖南省长沙市芙蓉区人民中路中惠锦堂5栋3201</p>
    </div>
    <div class="detail">
      <h3 class="detail-title fb mb5">电话 l Telephone</h3>
      <p>浙江：<text @click="call('0571-87131599')">0571-87131599</text></p>
      <p>徐栋：<text @click="call('15605818590')">15605818590</text></p>
      <p>汪立明：<text @click="call('15397067106')">15397067106</text></p>
      <p>湖南：<text @click="call('0731-88317800')">0731-88317800</text></p>
      <p>张银超：<text @click="call('17708470966')">17708470966</text></p>
    </div>
    <div class="detail">
      <h3 class="detail-title fb mb5">邮箱 l Email</h3>
      <p>邮箱：ngwb2006@163.com</p>
    </div>
  </div>
</template>

<script lang="ts" src="./contact.ts"></script>

<style lang="scss" scoped>
@import './contact.scss';
</style>
