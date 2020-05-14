import Vue from "vue";
import App from "./mine.vue";

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: "我的",
  },
};
