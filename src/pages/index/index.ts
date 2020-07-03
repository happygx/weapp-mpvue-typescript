// index.ts
import { Vue, Component } from 'vue-property-decorator';

// 必须使用装饰器的方式来指定component
@Component({
  name: 'index',
  components: {
    //
  },
})
export default class Index extends Vue {
  private bg1: string = require('@/assert/img/swiper1.png');
  private bg2: string = require('@/assert/img/swiper2.png');
  // private canIUse: any = wx.canIUse("button.open-type.getUserInfo");

  onLoad() {
    // console.log(this.globalData)
  }

  onShow() {
    // 小程序 hook
    this.init();
  }

  mounted() {
    // vue hook
  }

  init() {
    //
  }
}
