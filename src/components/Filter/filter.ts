import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { formatDate } from '@/utils/common';

@Component({
  name: 'filter',
})
export default class Filter extends Vue {
  // prop
  @Prop({
    required: true,
  })
  private dropdownConfig: object[];
  @Prop({
    required: true,
  })
  private timeConfig: object;

  // data
  private timeData: object = {};
  private timeShow: boolean = false;
  private timeType: string = '';

  // 小程序 hook
  onShow() {
    //
  }

  // vue hook
  mounted() {
    this.init();
  }

  // 初始化函数
  init() {
    this.timeData = { ...this.timeConfig };
  }

  selectTime(type: string) {
    this.timeType = type;
    this.timeShow = true;
  }

  timeClose() {
    this.timeShow = false;
  }

  timeConfirm(val: any) {
    this.timeData[this.timeType] = formatDate(val.mp.detail, 'yyyy-MM-dd');
    this.timeClose();
  }

  @Emit()
  confirm(o: object) {
    // console.log(o);
  }

  filterConfirm() {
    this.confirm(this.timeData);
  }
}
