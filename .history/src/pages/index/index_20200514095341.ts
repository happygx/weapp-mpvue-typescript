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

  onShow() {
    // 小程序 hook
  }

  mounted() {
    // vue hook
  }
}

export default Index;
