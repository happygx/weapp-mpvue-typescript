<template>
  <div class="filter-wrap">
    <van-dropdown-menu>
      <van-dropdown-item
        v-for="(item, index) in dropdownConfig"
        :key="index"
        :title="item.title"
        :value="item.value"
        :options="item.options"
        @change="item.operate"
      />
      <van-dropdown-item id="filter" title="筛选" v-if="timeData">
        <van-cell
          title="开始时间"
          :value="timeData.startDay"
          @click="selectTime('startDay')"
        />
        <van-cell
          title="结束时间"
          :value="timeData.endDay"
          @click="selectTime('endDay')"
        />
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
      :default-date="timeData.maxDate"
      color="#1989fa"
      @close="timeClose"
      @confirm="timeConfirm"
    />
  </div>
</template>

<script lang="ts" src="./filter.ts"></script>

<style lang="scss" scoped>
@import './filter.scss';
</style>
