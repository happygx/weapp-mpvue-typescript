import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'notice',
  components: {},
})
export default class Notice extends Vue {
  // data
  private NoticeName: string = 'notice';

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
}
