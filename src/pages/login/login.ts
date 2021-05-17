/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-04-26 15:53:42
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { wxLogin } from '@/api/common';
import { UserModule } from '@/store/module/login';
import { checkSession, getSession } from '@/utils/session';

@Component({
  name: 'login',
  components: {}
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
    if (UserModule.session) {
      checkSession();
    } else {
      getSession();
    }
  }

  onChange(e: any, type: string) {
    this[type] = e.mp.detail.value;
  }

  onClickIcon() {
    this.passwordShow = !this.passwordShow;
  }

  // 被弃用
  // bindGetUserInfo(e: any) {
  //   // if (this.username === '' || this.username === '') {
  //   //   this.$tip('不能为空！');
  //   //   return false;
  //   // }
  //   let userInfo = e.target.userInfo;
  //   // console.log(userInfo);
  //   if (userInfo) {
  //     this.encryptedData = e.target.encryptedData;
  //     this.iv = e.target.iv;
  //     this.login();
  //   }
  // }

  getUserProfile(e: any) {
    if (this.username === '' || this.username === '') {
      this.$tip('不能为空！');
      return false;
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res: any) => {
        this.encryptedData = res.encryptedData;
        this.iv = res.iv;
        this.login();
      }
    });
  }

  login() {
    wxLogin({
      method: 'POST',
      data: {
        username: this.username,
        password: this.password,
        encryptedData: this.encryptedData,
        iv: this.iv
      }
    }).then((res: any) => {
      if (res) {
        UserModule.SET_INFO_ASYNC(res.info);
        UserModule.SET_BROWSE_ASYNC(res.browse_permissions);
        wx.switchTab({
          url: '/pages/index/main'
        });
      }
    });
  }
}
