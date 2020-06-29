<template>
  <div class="popup-wrap">
    <van-popup custom-class="popup" :show="show" @close="cancel">
      <h3 class="title pl20 mb10">{{ title }}</h3>
      <van-field
        :label="title"
        :placeholder="'请输入' + title"
        autosize
        type="textarea"
        title-width="70px"
        :show-confirm-bar="false"
        :value="closeContent"
        @input="closeContent = $event.mp.detail"
      />
      <footer>
        <van-button class="mr10" type="default" size="small" @click="cancel"
          >取消</van-button
        >
        <van-button type="info" size="small" @click="popupConfirm()"
          >确认</van-button
        >
      </footer>
    </van-popup>
  </div>
</template>

<script lang="ts" src="./popup.ts"></script>

<style lang="scss">
@import './popup.scss';
</style>
