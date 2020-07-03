<template>
  <div class="question-wrap">
    <van-grid column-num="3" :border="false">
      <van-grid-item
        v-if="page.mineQuestion"
        use-slot
        content-class="grid-item"
        link-type="navigateTo"
        url="/pages/question/mine/main"
      >
        <van-icon custom-class="iconfont iconquestion red" :info="mineCount" />
        <span class="mt5 fb">我的问题</span>
      </van-grid-item>
      <van-grid-item
        v-if="page.upcoming"
        use-slot
        content-class="grid-item"
        link-type="navigateTo"
        url="/pages/question/upcoming/main"
      >
        <van-icon
          custom-class="iconfont icondaiban yellow"
          :info="upcomingCount"
        ></van-icon>
        <span class="mt5 fb">待办问题</span>
      </van-grid-item>
      <van-grid-item
        v-if="page.attention"
        use-slot
        content-class="grid-item"
        link-type="navigateTo"
        url="/pages/question/attention/main"
      >
        <van-icon custom-class="iconfont iconguanzhu orange"></van-icon>
        <span class="mt5 fb">我的关注</span>
      </van-grid-item>
      <van-grid-item
        v-if="page.questionList"
        use-slot
        content-class="grid-item"
        link-type="navigateTo"
        url="/pages/question/list/main"
      >
        <van-icon custom-class="iconfont iconlist cyan"></van-icon>
        <span class="mt5 fb">问题列表</span>
      </van-grid-item>
      <van-grid-item
        v-if="page.questionCreate"
        use-slot
        content-class="grid-item"
        link-type="navigateTo"
        url="/pages/question/create/main"
      >
        <van-icon custom-class="iconfont iconcreatequestion olive"></van-icon>
        <span class="mt5 fb">创建问题</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import './index.scss';
</style>
