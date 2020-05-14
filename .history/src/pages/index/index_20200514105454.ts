// index.ts
import { Vue, Component } from "vue-property-decorator";

// 必须使用装饰器的方式来指定component
@Component({
  components: {
    //
  },
})
class Index extends Vue {
  private name: string = "index";

  onLoad() {
    console.log(this.$root);
    wx.setNavigationBarTitle({
      title: "修改后的导航栏标题",
      success: function (res) {
        // success
      },
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
