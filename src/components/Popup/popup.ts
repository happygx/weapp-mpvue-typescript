import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  name: 'popup',
})
export default class Popup extends Vue {
  // prop
  @Prop({
    required: true,
  })
  show: boolean;
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: false,
    default: '',
  })
  content: string;

  // data
  private closeContent: string = '';

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

  @Watch('content')
  onChange(newVal: string) {
    this.closeContent = newVal;
  }

  @Emit()
  cancel() {}

  @Emit()
  confirm(content: string) {}

  popupConfirm() {
    if (this.closeContent === '') {
      this.$tip(`${this.title}不能为空！`);
    } else {
      this.confirm(this.closeContent);
      this.closeContent = '';
    }
  }
}
