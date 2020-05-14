import Vue from "vue";
import App from "./mine.vue";

export default {
  config: {
    navigationBarTitleText: "查看启动日志",
  },
};

const app = new Vue(App);
app.$mount();
