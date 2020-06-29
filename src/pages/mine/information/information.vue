<template>
  <div class="information-wrap">
    <van-cell title="用户名" :value="info.username" />
    <van-cell title="姓名" :value="name" is-link @click="showPopup('name')" />
    <van-cell
      title="性别"
      :value="getGender"
      is-link
      @click="showPopup('gender')"
    />
    <van-cell
      title="手机号"
      :value="phone"
      is-link
      @click="showPopup('phone')"
    />
    <van-popup closeable position="bottom" :show="isShow" @close="closePopup">
      <div class="mt30 popup clearfix">
        <div class="mb20 popup-content">
          <template v-if="type === 'name'">
            <van-field
              label="姓名"
              placeholder="请输入姓名"
              clearable
              :value="name"
              @input="name = $event.mp.detail"
            />
          </template>
          <template v-else-if="type === 'gender'">
            <van-radio-group
              class="radio-group"
              :value="gender"
              @change="gender = $event.mp.detail"
            >
              <van-radio :name="0" class="radio">女</van-radio>
              <van-radio :name="1" class="radio">男</van-radio>
            </van-radio-group>
          </template>
          <template v-else>
            <van-cell-group>
              <van-field
                label="手机号码"
                placeholder="请输入手机号码"
                clearable
                :value="phone"
                @input="phone = $event.mp.detail"
              />

              <van-field
                :value="aptcha"
                center
                clearable
                label="短信验证码"
                placeholder="请输入短信验证码"
                use-button-slot
                @input="captcha = $event.mp.detail"
              >
                <van-button
                  slot="button"
                  size="small"
                  type="primary"
                  @click="isSend && sendCode()"
                >
                  {{ sendText }}
                </van-button>
              </van-field>
            </van-cell-group>
          </template>
        </div>
        <van-button type="info" class="fr mr10" @click="save">保存</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" src="./information.ts"></script>

<style lang="scss" scoped>
@import './information.scss';
</style>
