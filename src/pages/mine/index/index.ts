/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2020-12-17 16:04:12
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { wxLogout } from '@/api/common';
import { UserModule } from '@/store/module/login';
import { routeInterception } from '@/utils/common';

// 必须使用装饰器的方式来指定component
@Component({
  components: {}
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
      url: '/pages/login/main'
    });
  }

  logout() {
    wxLogout().then((res: any) => {
      UserModule.ResetToken();
      Object.assign(this.$data, (this.$options as any).data());
    });
  }

  route(name: string) {
    routeInterception(name);
  }
}
