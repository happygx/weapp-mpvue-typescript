import { Vue, Component } from 'vue-property-decorator';
import { wxLogin } from '@/api/common';
import { UserModule } from '@/store/module/user';
import { getSession } from '@/utils/session';
import { getStorage } from '@/utils/common';

@Component({
  name: 'login',
  components: {},
})
export default class Login extends Vue {
  // data
  private username: string = '';
  private password: string = '';
  private encryptedData: string = '';
  private iv: string = '';
  private passwordShow: boolean = true;

  // 监听页面加载
  onLoad() {
    this.init();
  }

  // 小程序 hook
  onShow() {
    //
  }

  // vue hook
  mounted() {
    //
  }

  // 初始化函数
  init() {
    //
  }

  onChange(e: any, type: string) {
    this[type] = e.mp.detail.value;
  }

  onClickIcon() {
    this.passwordShow = !this.passwordShow;
  }

  bindGetUserInfo(e: any) {
    if (this.username === '' || this.username === '') {
      this.$tip('不能为空！');
      return false;
    }
    let userInfo = e.target.userInfo;
    // console.log(userInfo);
    if (userInfo) {
      this.encryptedData = e.target.encryptedData;
      this.iv = e.target.iv;
      getStorage('session', false, (res: any) => {
        if (res) {
          this.login();
        } else {
          getSession(this.login);
        }
      });
    }
  }

  login() {
    wxLogin({
      method: 'POST',
      data: {
        username: this.username,
        password: this.password,
        encryptedData: this.encryptedData,
        iv: this.iv,
      },
    }).then((res: any) => {
      if (res) {
        UserModule.SET_INFO_ASYNC(res.info);
        UserModule.SET_BROWSE_ASYNC(res.browse_permissions);
        wx.switchTab({
          url: '/pages/index/main',
        });
      }
    });
  }
}
