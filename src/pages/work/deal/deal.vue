<template>
  <div class="deal-wrap">
    <van-cell-group :border="false">
      <van-field
        label="工单编号"
        disabled
        :border="false"
        :value="workData.code"
      />
      <van-field
        label="仓库名称"
        disabled
        :border="false"
        :value="workData.building_name"
      />
      <van-cell
        v-if="roles !== '养护员'"
        title="仓库记录"
        title-width="90px"
        :border="false"
      >
        <span class="fl mr10 tl">{{ workData.building_record }}</span>
        <van-icon
          name="edit"
          class="fl f16"
          custom-class="edit"
          @click="recordShow = true"
        />
      </van-cell>
      <Popup
        title="仓库记录"
        :show="recordShow"
        :content="workData.building_record"
        @cancel="recordShow = false"
        @confirm="recordConfirm"
      />
      <van-field
        label="创建人"
        disabled
        :border="false"
        :value="workData.creator_name"
      />
      <van-field
        label="创建时间"
        disabled
        :border="false"
        :value="questionsData.create_time"
      />
      <van-cell
        v-if="!isView || devices.length > 0"
        :border="false"
        title="更换部件"
        title-width="90px"
      >
        <van-button
          v-if="!isView"
          type="info"
          size="small"
          class="fl"
          @click="popupShow('deviceShow')"
        >
          添加部件
        </van-button>
      </van-cell>
      <!-- <van-cell
        v-if="!isView && devices.length > 0"
        :border="false"
        title=" "
        title-width="90px"
      >
        <van-tag
          v-for="(item, index) in devices"
          :key="index"
          class="fl mr15"
          plain
          :closeable="isView ? false : true"
          size="medium"
          type="primary"
          @close="delDevice(index)"
        >
          {{ item.location }}
        </van-tag>
      </van-cell> -->
    </van-cell-group>
  </div>
</template>

<script lang="ts" src="./deal.ts"></script>

<style lang="scss">
@import './deal.scss';
</style>
