import { Vue, Component } from 'vue-property-decorator';
import { sendVerificationCode, compareVerificationCode, userInformationUpdate } from '@/api/mine';
import { getStorage, setStorage } from '@/utils/common';

@Component({
  name: 'information',
  components: {}
})
export default class Information extends Vue {
  // data
  private info: any = {};
  private isShow: boolean = false;
  private type: string = '';
  private name: string = '';
  private gender: number | string = '';
  private phone: string = '';
  private captcha: number | string = '';
  private isSend: boolean = true;
  private sendText: string = '发送验证码';

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
    this.info = getStorage('info', true);
    this.name = this.info.name;
    this.gender = this.info.gender;
    this.phone = this.info.phone;
  }

  get getGender() {
    return this.info.gender === 0 ? '女' : '男';
  }

  showPopup(type: string) {
    this.type = type;
    this.isShow = true;
  }

  closePopup() {
    this.isShow = false;
  }

  sendCode() {
    let reg = /^1[34578]\d{9}$/;
    if (!reg.test(this.phone)) {
      this.$tip('请输入正确的手机号');
      return false;
    } else {
      sendVerificationCode({
        data: {
          phone: this.phone
        }
      }).then((res: any) => {
        this.isSend = false;
        let num = 60;
        this.sendText = num + '（s）';
        let interval = setInterval(() => {
          if (num > 0) {
            num--;
            this.sendText = num + '（s）';
          } else {
            this.sendText = '发送验证码';
            clearInterval(interval);
          }
        }, 1000);
      });
    }
  }

  async save() {
    if (this[this.type] !== '') {
      if (this.type === 'phone') {
        let res = await compareVerificationCode({
          data: {
            phone: this[this.type],
            code: this.captcha
          }
        });
      }
      this.saveInfo();
    } else {
      this.$tip('不能为空！');
    }
  }

  saveInfo() {
    userInformationUpdate({
      method: 'PUT',
      data: {
        [this.type]: this[this.type]
      }
    }).then((res: any) => {
      this.info[this.type] = this[this.type];
      this.closePopup();
      setStorage('info', this.info);
    });
  }
}
