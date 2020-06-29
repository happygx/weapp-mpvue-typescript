<template>
  <div class="create-wrap">
    <van-cell-group :border="false">
      <van-field
        label="仓库名称"
        placeholder="请选择仓库名称"
        required
        :disabled="disabled"
        :border="false"
        :value="buildingName"
        @click="!disabled && (companyShow = true)"
      />
      <Company
        v-if="companyShow"
        :buildingsData="buildingsData"
        @onCancel="companyShow = false"
        @onSelect="selectBuilding"
      />
      <van-cell
        :border="false"
        title="工单类型"
        title-width="90px"
        title-class="required"
      >
        <van-radio-group
          class="radio-group"
          :disabled="disabled"
          :value="operation"
          @change="operationChange"
        >
          <van-radio :name="14" class="mr15" icon-size="16px">维修单</van-radio>
          <van-radio :name="15" class="mr15" icon-size="16px">维保单</van-radio>
          <van-radio :name="16" icon-size="16px">善后单</van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell
        v-if="operation !== 15"
        :border="false"
        title="工单问题"
        title-width="90px"
        title-class="required"
      >
        <van-button type="info" size="small" class="fl" @click="selectQuestion">
          选择问题
        </van-button>
      </van-cell>
      <Question
        v-if="questionShow"
        :buildingId="buildingId"
        :selectRows="selectRows"
        @cancel="questionShow = false"
        @confirm="questionConfirm"
      />
      <van-cell
        v-for="(item, index) in selectRows"
        :key="index"
        :border="false"
      >
        <div slot="title">
          <div class="title">
            <h3 class="mr10 fb f16" @click="item.click">
              {{ item.building_abbreviation }}
            </h3>
            <van-tag class="mr15" v-if="tagType" :type="tagType[item.rank]">
              {{ item.classification_name }}
            </van-tag>
            <van-icon
              v-if="item.record.length > 0 && item.record[0].revisable"
              class="mr10 f16"
              name="edit"
              @click="suggest(index)"
            />
            <van-icon
              v-else
              class="mr10 f16"
              name="add-o"
              @click="suggest(index)"
            />
            <van-icon class="f16" name="close" @click="deleteQuestion(index)" />
          </div>
          <div class="detail mt10">
            <p v-for="(header, j) in tableHeader" :key="j">
              <i
                v-if="header.prop === 'visibleName'"
                class="iconfont mr5"
                :class="[
                  header.icon,
                  {
                    green: item.visible,
                  },
                ]"
              ></i>
              <i v-else class="iconfont mr5" :class="header.icon" />
              <span>{{ item[header.prop] }}</span>
            </p>
          </div>
          <div class="content mt5" v-if="item.content">
            <span>详情：</span>
            <span style="word-break: break-all;">{{ item.content }}</span>
          </div>
          <div
            class="content mt5"
            v-if="item.record.length > 0 && item.record[0].revisable"
          >
            <span>建议：</span>
            <span style="word-break: break-all;">{{
              item.record[0].suggest
            }}</span>
          </div>
        </div>
      </van-cell>
      <Popup
        title="处理建议"
        :show="suggestShow"
        :content="suggestContent"
        @cancel="suggestCancel"
        @confirm="suggestConfirm"
      />
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <van-button
      v-if="!disabled"
      type="info"
      size="large"
      custom-class="mt20"
      @click="submit"
    >
      立即创建
    </van-button>
  </div>
</template>

<script lang="ts" src="./create.ts"></script>

<style lang="scss">
@import './create.scss';
</style>
