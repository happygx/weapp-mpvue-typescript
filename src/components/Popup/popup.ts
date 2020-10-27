import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  name: 'popup',
})
export default class Popup extends Vue {
  // prop
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
    this.closeContent = this.content;
  }

  onChange(e: any) {
    this.closeContent = e.mp.detail.value;
  }

  @Emit()
  cancel() {}

  @Emit()
  confirm(content: string) {}

  popupConfirm() {
    // 让onChange先获取值
    setTimeout(() => {
      if (this.closeContent === '') {
        this.$tip(`${this.title}不能为空！`);
      } else {
        this.confirm(this.closeContent);
      }
    }, 100);
  }
}
