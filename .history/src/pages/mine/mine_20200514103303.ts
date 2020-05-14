// index.ts
import { Vue, Component } from "vue-property-decorator";

// 必须使用装饰器的方式来指定component
@Component({
  components: {
    //
  },
})
class Index extends Vue {
  // data
  private name: string = "mine";

  onLoad() {
    wx.setNavigationBarTitle({
      title: "当前页面",
    });
  }

  onShow() {
    // 小程序 hook
  }

  mounted() {
    // vue hook
  }
}

export default Index;
