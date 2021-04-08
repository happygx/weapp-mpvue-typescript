import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'contact',
  components: {}
})
export default class Contact extends Vue {
  // data
  private banner: string = require('@/assert/img/contact.jpg');

  // 监听页面加载
  onLoad() {
    //
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

  call(phone: string) {
    wx.makePhoneCall({
      phoneNumber: phone,
      success: res => {
        // console.log(res);
      }
    });
  }
}
