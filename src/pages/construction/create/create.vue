<!--
 * @Description:
 * @Author: happy
 * @Date: 2021-02-25 16:09:21
 * @LastEditTime: 2021-02-25 17:16:22
 * @LastEditors: happy
-->
<template>
  <div class="create-wrap">
    <Company
      v-if="companyShow"
      :buildingsData="buildingsData"
      @onCancel="popupShow('companyShow')"
      @onSelect="selectBuilding"
    />
    <van-cell-group :border="false" custom-class="cell-group">
      <van-field
        label="仓库名称"
        required
        disabled
        :border="false"
        :value="buildingName"
        @click="popupShow('companyShow')"
      />
      <van-field
        label="问题分类"
        placeholder="请选择问题分类"
        disabled
        required
        :border="false"
        :value="classificationName"
        @click="popupShow('classificationShow')"
      />
      <van-field
        v-if="textareaShow"
        label="问题详情"
        placeholder="请输入问题详情"
        required
        autosize
        type="textarea"
        :show-confirm-bar="false"
        :border="false"
        :value="form.content"
        @input="form.content = $event.mp.detail"
      />
      <!-- textarea的替代样式，为了解决textarea层级过高导致文字穿透浮层的问题 -->
      <van-cell
        required
        v-if="!textareaShow"
        title="问题详情"
        title-width="90px"
        title-class="required"
        :border="false"
      >
        <p class="tl" :class="{ placeholder: form.content === '' }">
          {{ form.content === '' ? '请输入问题详情' : form.content }}
        </p>
      </van-cell>
      <van-cell :border="false" title="上传附件" title-width="90px">
        <van-uploader
          class="fl"
          accept="media"
          preview-size="55px"
          max-count="5"
          :file-list="fileList"
          @afterRead="afterRead"
          @delete="handleRemove"
        />
      </van-cell>
    </van-cell-group>
    <van-dialog id="van-dialog" />
    <div class="btn-group">
      <van-button type="info" size="large" @click="submit" :custom-class="getWidth">
        创建问题
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" src="./create.ts"></script>

<style lang="scss">
@import './create.scss';
</style>
