/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:53
 * @LastEditTime: 2021-05-13 14:27:47
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { UserModule } from '@/store/module/login';
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
    this.checkUpdate();
    if (UserModule.session) {
      checkSession();
    }
    if (UserModule.info) {
      this.getUserInfo();
    }
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

  checkUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate);
    });
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示！',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(err => {
      // 新版本下载失败
      throw err;
    });
  }

  getUserInfo() {
    userInformationData().then((res: any) => {
      UserModule.SET_INFO_ASYNC(res.info);
    });
  }
}
