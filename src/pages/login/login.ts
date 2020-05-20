import { Vue, Component } from 'vue-property-decorator';
import { userSensitiveData } from '@/api/common';
import Toast from '../../../static/vant/toast/toast';
import { UserModule } from '@/store/module/user';

@Component({
  name: 'login',
  components: {},
})
export default class Login extends Vue {
  // data
  private form: any = {
    username: '',
    password: '',
    encryptedData: '',
    iv: '',
  };
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

  onClickIcon() {
    this.passwordShow = !this.passwordShow;
  }

  bindGetUserInfo(e: any) {
    if (this.form.username === '' || this.form.username === '') {
      Toast('不能为空！');
      return false;
    }
    let userInfo = e.target.userInfo;
    // console.log(userInfo);
    if (userInfo) {
      this.form.encryptedData = e.target.encryptedData;
      this.form.iv = e.target.iv;
      UserModule.Login(this.form);
      wx.switchTab({
        url: '/pages/index/main',
      });
    }
  }
}
