<template>
  <div class="question-wrap">
    <van-popup show="true" duration="0" custom-class="question-popup">
      <div class="table">
        <TableCom
          ref="table"
          :tableConfig="tableConfig"
          @handleSelection="handleSelection"
        />
      </div>
      <div class="btn-group mt20">
        <van-button size="large" @click="cancel">
          取消
        </van-button>
        <van-button
          style="margin-left: 10%;"
          type="info"
          size="large"
          @click="addQuestion"
        >
          确认
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" src="./question.ts"></script>

<style lang="scss">
@import './question.scss';
</style>
