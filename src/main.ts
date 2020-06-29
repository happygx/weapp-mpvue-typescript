import { Component, Vue } from 'vue-property-decorator';
import { VueConstructor } from 'vue';
import { DataModule } from '@/store/module/data';
import { objectAssign, tip } from '@/utils/common';
import '@/assert/css/variables.scss';
import '@/assert/font/iconfont.css';

// 解决页面数据缓存的问题
Vue.mixin({
  // 监听页面加载
  onLoad() {
    // 判断是否为组件
    if (this.$options.parent) {
      if (!DataModule.Data[this._uid]) {
        const data = {
          [this._uid]: JSON.parse(JSON.stringify(this.$data)),
        };
        DataModule.PUSH_DATA_ASYNC(data);
      }
    }
  },
  // 监听页面卸载
  onUnload() {
    if (this.$options.parent) {
      objectAssign(this.$data, DataModule.Data[this._uid]);
    } else {
      if (this.$options.data) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
});

interface IMpVue extends VueConstructor {
  mpType: string;
}

// 添加小程序hooks http://mpvue.com/mpvue/#_4
Component.registerHooks([
  // app
  'onLaunch', // 初始化
  'onShow', // 当小程序启动，或从后台进入前台显示
  'onHide', // 当小程序从前台进入后台
  // pages
  'onLoad', // 监听页面加载
  'onShow', // 监听页面显示
  'onReady', // 监听页面初次渲染完成
  'onHide', // 监听页面隐藏
  'onUnload', // 监听页面卸载
  'onPullDownRefresh', // 监听用户下拉动作
  'onReachBottom', // 页面上拉触底事件的处理函数
  'onShareAppMessage', // 用户点击右上角分享
  'onPageScroll', // 页面滚动
  'onTabItemTap', //当前是 tab 页时， 点击 tab 时触发 （mpvue 0.0.16 支持）
]);

// 定义全局方法
Vue.prototype.$tip = tip;
// 定义全局函数
declare module 'vue/types/vue' {
  interface Vue {
    $tip: (msg: string) => {};
  }
}

// Vue.config._mpTrace = true;
Vue.config.productionTip = false;
// 在这个地方引入是为了registerHooks先执行
const MyApp = require('./App.vue').default as IMpVue;
const app = new Vue(MyApp);
app.$mount();
