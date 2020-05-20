// index.ts
import { Vue, Component } from 'vue-property-decorator';

// 必须使用装饰器的方式来指定component
@Component({
  components: {
    //
  },
})
export default class Index extends Vue {
  private name: string = 'index';
  // private canIUse: any = wx.canIUse("button.open-type.getUserInfo");

  onLoad() {
    // console.log(this.globalData)
  }

  onShow() {
    // 小程序 hook
  }

  mounted() {
    // vue hook
  }
}
