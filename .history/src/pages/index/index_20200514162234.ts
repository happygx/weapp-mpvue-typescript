// index.ts
import Vue from "vue";
import { Component } from "vue-property-decorator";

// 必须使用装饰器的方式来指定component
@Component({
  components: {
    //
  },
})
class Index extends Vue {
  private name: string = "index";

  onLoad() {
    //
  }

  onShow() {
    // 小程序 hook
  }

  mounted() {
    // vue hook
  }
}

export default Index;

console.log(Vue);

import App from "./index.vue";

const app = new Vue(App);
app.$mount();
