<template>
  <div class="create-wrap">
    <van-tabs
      v-if="isTagsShow"
      color="#1fc2dc"
      line-width="100"
      :active="tabActive"
      @change="tabActive = $event.target.name"
    >
      <van-tab custom-class="tab" title="推荐解决方案">
        <van-collapse
          accordion
          :value="collapseActive"
          @change="collapseChange"
        >
          <van-collapse-item
            v-for="(item, index) in classificationsData"
            :key="index"
            :title="item.name"
            :name="item.id"
          >
            <h4 class="mb10">
              智能在线为您推荐解决率最高的
              <span class="orange fb">{{ solutionsData.length }}</span>
              条热门知识点，可能有您需要的答案：
            </h4>
            <div class="solutions">
              <p v-for="(s, i) in solutionsData" :key="i">
                {{ i + 1 }}、{{ s.solution }}
              </p>
            </div>
            <div class="create mt10">
              <h4 class="f16 fb mb5" @click="create(item)">创建问题</h4>
              <p>公司的售后人员会在三天之内解决</p>
            </div>
          </van-collapse-item>
        </van-collapse>
      </van-tab>
      <van-tab title="创建问题" :disabled="tabActive !== 1"> </van-tab>
    </van-tabs>
    <Add
      v-if="(roles !== '养护员' || tabActive === 1) && componentShow"
      :classificationsData="classificationsData"
      :classification="classification"
    />
  </div>
</template>

<script lang="ts" src="./create.ts"></script>

<style lang="scss">
@import './create.scss';
</style>
