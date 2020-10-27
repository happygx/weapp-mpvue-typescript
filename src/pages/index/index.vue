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
    <template v-if="browse">
      <div class="grid-wrap">
        <h3 class="title f16">
          <i class="point mr5"></i>
          问题处理
        </h3>
        <van-grid column-num="3" :border="false">
          <van-grid-item
            v-if="page.mineQuestion"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/question/mine/main"
          >
            <van-icon custom-class="iconfont icon-question red" />
            <span class="mt5">我的问题</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.attention"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/question/attention/main"
          >
            <van-icon custom-class="iconfont icon-attention orange"></van-icon>
            <span class="mt5">我的关注</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.questionSurvey"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/question/survey/main"
          >
            <van-icon custom-class="iconfont icon-survey yellow"></van-icon>
            <span class="mt5">问题概况</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.upcoming"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/question/upcoming/main"
          >
            <van-icon custom-class="iconfont icon-upcoming olive" :info="questionUpcomingCount"></van-icon>
            <span class="mt5">待办问题</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.questionList"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/question/list/main"
          >
            <van-icon custom-class="iconfont icon-list cyan"></van-icon>
            <span class="mt5">问题列表</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.questionCreate"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/question/create/main"
          >
            <van-icon custom-class="iconfont icon-createQuestion blue"></van-icon>
            <span class="mt5">创建问题</span>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="grid-wrap">
        <h3 class="title f16">
          <i class="point mr5"></i>
          工单处理
        </h3>
        <van-grid column-num="3" :border="false">
          <van-grid-item
            v-if="page.UpcomingDistribution"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/work/mine/main?type=distribution"
          >
            <van-icon custom-class="iconfont icon-distribution red" :info="mineWorkflowCountData.new_workflow_count" />
            <span class="mt5">待您分配</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.upcomingWorkflow"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/work/mine/main?type=upcoming"
          >
            <van-icon
              custom-class="iconfont icon-upcoming orange"
              :info="mineWorkflowCountData.backlog_workflow_count"
            />
            <span class="mt5">待办工单</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.UpcomingConfirm"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/work/mine/main?type=confirm"
          >
            <van-icon
              custom-class="iconfont icon-confirm yellow"
              :info="mineWorkflowCountData.unconfirmed_workflow_count"
            />
            <span class="mt5">待您确认</span>
          </van-grid-item>

          <van-grid-item
            v-if="page.mineWorkflow"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/work/mine/main"
          >
            <van-icon custom-class="iconfont icon-workflow olive" />
            <span class="mt5">我的工单</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.workflowList"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/work/list/main"
          >
            <van-icon custom-class="iconfont icon-workflowList cyan"></van-icon>
            <span class="mt5">工单列表</span>
          </van-grid-item>
          <van-grid-item
            v-if="page.workflowCreate"
            use-slot
            content-class="grid-item"
            link-type="navigateTo"
            url="/pages/work/create/main"
          >
            <van-icon custom-class="iconfont icon-workflowCreate blue"></van-icon>
            <span class="mt5">创建工单</span>
          </van-grid-item>
        </van-grid>
      </div>
    </template>
    <template v-else>
      <div class="login tac">
        <p class="mb10 f14 tip" @click="login">登录后可以访问首页</p>
      </div>
    </template>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import './index.scss';
</style>
