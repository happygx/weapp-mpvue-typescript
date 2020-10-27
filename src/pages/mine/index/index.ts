import { Vue, Component } from 'vue-property-decorator';
import { wxLogout } from '@/api/common';
import { UserModule } from '@/store/module/user';
import { routeInterception } from '@/utils/common';

// 必须使用装饰器的方式来指定component
@Component({
  components: {},
})
export default class Mine extends Vue {
  // data
  private info: object | boolean = false;

  onLoad() {
    //
  }

  // 小程序 hook
  onShow() {
    this.init();
  }

  // vue hook
  mounted() {
    //
  }

  init() {
    this.info = UserModule.info ? UserModule.info : false;
  }

  login() {
    wx.navigateTo({
      url: '/pages/login/main',
    });
  }

  logout() {
    wxLogout().then((res: any) => {
      UserModule.ResetToken();
      Object.assign(this.$data, this.$options.data());
    });
  }

  route(name: string) {
    routeInterception(name);
  }
}
