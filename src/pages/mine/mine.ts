import { Vue, Component } from 'vue-property-decorator';
// import { wxLogout } from '@/api/common';
import { UserModule } from '@/store/module/user';
import { routeInterception } from '@/utils/common';

// 必须使用装饰器的方式来指定component
@Component({
  components: {
    //
  },
})
export default class Mine extends Vue {
  // data
  private info: object | boolean = false;

  onLoad() {
    //
  }

  onShow() {
    // 小程序 hook
    this.init();
  }

  mounted() {
    // vue hook
  }

  init() {
    this.info = UserModule.info;
    console.log(this.info);
  }

  login() {
    wx.navigateTo({
      url: '/pages/login/main',
    });
  }

  logout() {
    UserModule.LogOut(() => {
      // 调用onShow初始化其中的方法，其实就是把数据初始化，页面不会刷新
      getCurrentPages()[getCurrentPages().length - 1].onShow();
    });
  }

  route(name: string) {
    routeInterception(name);
  }
}
