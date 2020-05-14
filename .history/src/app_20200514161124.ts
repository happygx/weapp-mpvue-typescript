import { Vue, Component } from "vue-property-decorator";
import { getOpenIdSessionKey } from "./api/common";
import { setStorage, getStorage } from "./utils/common";

const debug = require("debug")("log:App");
declare module "vue/types/vue" {
  interface Vue {
    $mp: any;
  }
}

// 必须使用装饰器的方式来指定components
@Component({
  mpType: "app", // mpvue特定
} as any)
class App extends Vue {
  // app hook
  onLaunch() {
    if (getStorage("session")) {
      this.getSession();
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

  getSession() {
    wx.login({
      success: (res) => {
        // console.log(res);
        getOpenIdSessionKey({
          data: {
            code: res.code,
          },
        }).then((result: any) => {
          setStorage("session", result.third_session);
        });
      },
    });
  }
}

export default App;
