import { Vue, Component } from "vue-property-decorator";
import axios from "@/utils/request";

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
    wx.login({
      success: (res) => {
        // console.log(res);
        // getOpenIdSessionKey({
        //   data: {
        //     code: res.code,
        //   },
        // }).then((result: any) => {
        //   console.log(result);
        // });

        axios({
          data: {
            url: "getOpenIdSessionKey",
            code: res.code,
          },
        }).then((result: any) => {
          console.log(result);
        });
      },
    });
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
}

export default App;
