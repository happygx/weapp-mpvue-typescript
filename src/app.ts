import { Vue, Component } from 'vue-property-decorator';
import { UserModule } from './store/module/user';
import { checkSession } from './utils/session';
import { userInformationData } from './api/mine';

// const debug = require("debug")("log:App");
declare module 'vue/types/vue' {
  interface Vue {
    $mp: any;
  }
}

// 必须使用装饰器的方式来指定components
@Component({
  mpType: 'app' // mpvue特定
} as any)
export default class App extends Vue {
  public get globalData() {
    return {
      userInfo: null,
      componentShow: false
    };
  }
  // app hook
  onLaunch() {
    if (UserModule.session) {
      checkSession();
    }
    this.getUserInfo();
  }

  onShow() {
    // debug("onShow");
  }

  onHide() {
    // debug("onHide");
  }

  mounted() {
    // vue hook
    // debug("mounted");
  }

  getUserInfo() {
    userInformationData().then((res: any) => {
      UserModule.SET_INFO_ASYNC(res.info);
    });
  }
}
