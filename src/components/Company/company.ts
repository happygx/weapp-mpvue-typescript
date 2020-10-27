import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  name: 'company',
})
export default class Company extends Vue {
  // prop
  @Prop({
    required: true,
    default: false,
  })
  show: boolean;
  @Prop({
    required: true,
  })
  buildingsData: object[];

  // data
  private buildings: object[] = [];

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
    this.buildings = this.buildingsData;
  }

  @Watch('buildingsData')
  onBuildingsChange(newVal: any) {
    this.buildings = newVal;
  }

  onChange(e: any) {
    let search = e.mp.detail;
    this.buildings = this.buildingsData.filter((val: any) => {
      return val.name.includes(search);
    });
  }

  @Emit('onCancel')
  onCancel() {}

  @Emit('onSelect')
  onSelect(b: object) {
    this.onCancel();
  }
}
