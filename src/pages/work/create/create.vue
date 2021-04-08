<template>
  <div class="create-wrap">
    <Company
      v-if="companyShow && componentShow"
      :buildingsData="buildingsData"
      @onCancel="companyShow = false"
      @onSelect="selectBuilding"
    />
    <Question
      v-if="questionShow && componentShow"
      :buildingId="buildingId"
      :selectRows="selectRows"
      @cancel="questionShow = false"
      @confirm="questionConfirm"
    />
    <van-cell-group :border="false" custom-class="cell-group">
      <van-cell :border="false" title="工单类型" title-width="90px" title-class="required">
        <van-radio-group
          class="radio-group"
          :disabled="disabled"
          :value="operation"
          @change="operationChange"
        >
          <van-radio :name="14" class="mr15" icon-size="16px">维修单</van-radio>
          <van-radio :name="15" class="mr15" icon-size="16px">维保单</van-radio>
          <van-radio :name="16" icon-size="16px">善后单</van-radio>
          <van-radio :name="17" icon-size="16px" class="mt15">调试单</van-radio>
        </van-radio-group>
      </van-cell>
      <van-field
        label="选择省份"
        placeholder="请选择省份"
        disabled
        :border="false"
        :value="province"
        @click="provinceShow = true"
      />
      <van-popup position="bottom" :show="provinceShow" @close="provinceShow = false">
        <van-picker
          show-toolbar
          title="请选择省份"
          value-key="name"
          :columns="provinces"
          @cancel="provinceShow = false"
          @confirm="provinceConfirm"
        />
      </van-popup>
      <van-field
        label="仓库名称"
        placeholder="请选择仓库名称"
        required
        disabled
        :border="false"
        :value="buildingName"
        @click="!disabled && (companyShow = true)"
      />
      <van-cell
        v-if="operation === 14 || operation === 16"
        :border="false"
        title="工单问题"
        title-width="90px"
        title-class="required"
      >
        <van-button type="info" size="small" class="fl" @click="selectQuestion">
          选择问题
        </van-button>
      </van-cell>
      <van-cell v-if="operation === 15" :border="false" title="同省仓库" title-width="90px">
        <van-checkbox
          custom-class="mb10"
          label-class="fb"
          shape="square"
          icon-size="15px"
          :value="isAll"
          @change="checkAll"
          >全选</van-checkbox
        >
        <van-checkbox
          v-for="(item, i) in provinceBuildingsData"
          :key="i"
          custom-class="mb10"
          shape="square"
          icon-size="15px"
          :value="item.checked"
          @change="item.checked = $event.mp.detail"
        >
          {{ item.abbreviation }}
        </van-checkbox>
      </van-cell>
    </van-cell-group>
    <van-cell v-for="(item, index) in selectRows" :key="index" :border="false">
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
          <van-icon v-else class="mr10 f16" name="add-o" @click="suggest(index)" />
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
                  green: item.visible
                }
              ]"
            ></i>
            <i v-else class="iconfont mr5" :class="header.icon" />
            <span>{{ item[header.prop] }}</span>
          </p>
        </div>
        <div class="content mt5" v-if="item.content">
          <span>详情：</span>
          <span class="break">{{ item.content }}</span>
        </div>
        <div class="content mt5" v-if="item.record.length > 0 && item.record[0].revisable">
          <span>建议：</span>
          <span class="break">{{ item.record[0].suggest }}</span>
        </div>
      </div>
    </van-cell>
    <Popup
      v-if="suggestShow && componentShow"
      title="处理建议"
      :content="suggestContent"
      @cancel="suggestCancel"
      @confirm="suggestConfirm"
    />
    <van-dialog id="van-dialog" />
    <div class="btn-group" v-if="!disabled">
      <van-button type="info" size="large" @click="onSubmit">
        立即创建
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./create.ts"></script>

<style lang="scss">
@import './create.scss';
</style>
