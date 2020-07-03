<template>
  <div class="tableCom-wrap">
    <van-swipe-cell
      v-for="(item, i) in tableConfig.tableData"
      :key="i"
      :right-width="item.operates !== undefined ? 65 * item.operates.length : 0"
    >
      <van-cell-group>
        <van-cell custom-class="list-item">
          <div slot="title">
            <div class="title">
              <van-checkbox
                v-if="tableConfig.checkbox"
                custom-class="mr5"
                :value="item.checked"
                shape="square"
                @change="checkedChange(item)"
              >
              </van-checkbox>
              <van-icon
                name="star"
                v-if="item.concern_status !== undefined"
                :color="item.concern_status === 10 ? '#39b54a' : '#515151'"
                class="mr5"
              />
              <h3 class="mr10 fb f16" @click="item.click">
                {{ item.building_abbreviation }}
              </h3>
              <van-tag v-if="tableConfig.workflowType" type="primary">
                {{ tableConfig.workflowType[item.kind] }}</van-tag
              >
              <van-tag
                v-if="tableConfig.tagType"
                :type="tableConfig.tagType[item.rank]"
              >
                {{ item.classification_name }}
              </van-tag>
            </div>
            <div class="detail mt10">
              <p v-for="(header, j) in tableConfig.tableHeader" :key="j">
                <i
                  v-if="header.prop === 'statusName'"
                  class="iconfont mr5"
                  :class="[
                    header.icon,
                    {
                      green: item.status < 40,
                    },
                  ]"
                ></i>
                <i
                  v-else-if="header.prop === 'visibleName'"
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
              <template v-if="item.ellipsis">
                <template v-if="item.isExpansion">
                  <span style="word-break: break-all;">{{ item.content }}</span>
                  <span class="expansion ml5" @click="expansion(item)"
                    >收起</span
                  >
                </template>
                <template v-if="!item.isExpansion">
                  <span>{{ item.ellipsis }}</span>
                  <span class="expansion ml5" @click="expansion(item)"
                    >展开</span
                  >
                </template>
              </template>
              <template v-else>
                <span>{{ item.content }}</span>
              </template>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
      <view slot="right" class="swipe-right">
        <p
          v-for="(operate, o) in item.operates"
          :key="o"
          class="btn"
          style="width: 65px;"
          @click="operate.clickFun"
        >
          {{ operate.name }}
        </p>
      </view>
    </van-swipe-cell>
    <template v-if="tableConfig.tableData.length > 0">
      <div class="load-more f14">
        <p v-if="tableConfig.isMore">
          加载中...
        </p>
        <p v-if="!tableConfig.isMore">
          没有更多数据了
        </p>
      </div>
    </template>
    <template v-else>
      <div class="loading-wrap f14" v-if="tableConfig.isLoading">
        <van-loading
          custom-class="loading"
          size="24px"
          type="spinner"
          vertical
          color="#1989fa"
        >
          拼命加载中...
        </van-loading>
      </div>
      <p class="load-more" v-else-if="tableConfig.isLoading === false">
        暂无数据
      </p>
    </template>
  </div>
</template>

<script lang="ts" src="./tableCom.ts"></script>

<style lang="scss">
@import './tableCom.scss';
</style>
