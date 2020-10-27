<template>
  <div class="survey-wrap">
    <Company
      v-if="companyShow && componentShow"
      :buildingsData="buildingsData"
      @onCancel="companyShow = false"
      @onSelect="selectBuilding"
    />
    <div class="df filter">
      <p class="building f14" :class="{ placeholder: buildingName === '' }" @click="companyShow = true">
        {{ buildingName === '' ? '请选择仓库名称' : buildingName }}
      </p>
      <i class="iconfont icon-time tac f14" @click="popupShow = true"></i>
    </div>
    <div class="question mt15">
      <div class="question-item mb5" v-for="(item, i) in classification" :key="i">
        <h3 class="fb">{{ item }}</h3>
        <div class="question-detail mt10 f14" v-for="(question, j) in questionData[item]" :key="j">
          <p>问题详情：{{ question.content }}</p>
          <p>
            {{ question.handler_time }}
            <span class="ml5 mr5">{{ question.handler_user_name }}</span>
            {{ question.result }}
          </p>
        </div>
      </div>
    </div>

    <van-popup v-if="popupShow" :show="true" custom-class="popup" position="bottom" @close="popupShow = false">
      <van-field :border="false" disabled label="开始时间" :value="timeConfig.startDay" @click="selectTime('start')" />
      <van-field :border="false" disabled label="结束时间" :value="timeConfig.endDay" @click="selectTime('end')" />
      <div class="btn-group">
        <van-button type="info" block round @click="popupConfirm">
          确定
        </van-button>
      </div>
    </van-popup>
    <van-calendar
      :show="timeShow"
      :min-date="timeConfig.minDate"
      :max-date="timeConfig.maxDate"
      :default-date="defaultDate"
      color="#1989fa"
      @close="timeShow = false"
      @confirm="timeConfirm"
    />
  </div>
</template>

<script lang="ts" src="./survey.ts"></script>

<style lang="scss">
@import './survey.scss';
</style>
