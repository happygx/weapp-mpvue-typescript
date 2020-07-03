<template>
  <div class="work-wrap">
    <template v-if="browse">
      <van-grid column-num="3" :border="false">
        <van-grid-item
          v-if="page.mineWorkflow"
          use-slot
          content-class="grid-item"
          link-type="navigateTo"
          url="/pages/work/mine/main"
        >
          <van-icon
            custom-class="iconfont iconworkflow red"
            :info="upcomingCount"
          />
          <span class="mt5 fb">我的工单</span>
        </van-grid-item>
        <van-grid-item
          v-if="page.workflowList"
          use-slot
          content-class="grid-item"
          link-type="navigateTo"
          url="/pages/work/list/main"
        >
          <van-icon custom-class="iconfont iconworkflowlist yellow"></van-icon>
          <span class="mt5 fb">工单列表</span>
        </van-grid-item>
        <van-grid-item
          v-if="page.workflowCreate"
          use-slot
          content-class="grid-item"
          link-type="navigateTo"
          url="/pages/work/create/main"
        >
          <van-icon
            custom-class="iconfont iconworkflowcreate orange"
          ></van-icon>
          <span class="mt5 fb">创建工单</span>
        </van-grid-item>
      </van-grid>
    </template>
    <template v-else>
      <div class="login tac">
        <p class="mb10 f14">登录后可以访问工单</p>
        <van-button type="info" round size="large" @click="login"
          >登录</van-button
        >
      </div>
    </template>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import './index.scss';
</style>
