<template>
  <div class="filter-wrap">
    <van-dropdown-menu>
      <van-dropdown-item
        v-for="(item, index) in dropdownData"
        :key="index"
        :title="item.title"
        :value="item.value"
        :options="item.options"
        @change="dropdownFilter($event, index)"
      />
      <van-dropdown-item id="filter" title="筛选" v-if="timeData">
        <div class="time-wrap">
          <div class="time">
            <p class="label">开始时间</p>
            <p
              class="value"
              :class="{ placeholder: timeData.startDay === '' }"
              @click="selectTime('start')"
            >
              {{ timeData.startDay === '' ? '请选择开始时间' : timeData.startDay }}
            </p>
          </div>
          <div class="time">
            <p class="label">结束时间</p>
            <p class="value" @click="selectTime('end')">
              {{ timeData.endDay }}
            </p>
          </div>
        </div>
        <div class="btn-group">
          <van-button type="info" block round @click="filterConfirm">
            确定
          </van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
    <van-calendar
      :show="timeShow"
      :min-date="timeData.minDate"
      :max-date="timeData.maxDate"
      :default-date="defaultDate"
      color="#1989fa"
      @close="timeShow = false"
      @confirm="timeConfirm"
    />
  </div>
</template>

<script lang="ts" src="./filter.ts"></script>

<style lang="scss">
@import './filter.scss';
</style>
