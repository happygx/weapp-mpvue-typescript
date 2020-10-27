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
  private timeData: any = {};
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
    this.timeData.startTime = new Date(this.timeData.startDay).getTime();
    this.timeData.endTime = new Date(this.timeData.endDay).getTime();
  }

  get defaultDate() {
    let date =
      this.timeType === 'start'
        ? this.timeData.startTime
        : this.timeData.endTime;
    if (isNaN(date)) {
      date = this.timeData.maxDate;
    }
    return date;
  }

  selectTime(type: string) {
    this.timeType = type;
    this.timeShow = true;
  }

  timeConfirm(val: any) {
    this.timeData[`${this.timeType}Day`] = formatDate(
      val.mp.detail,
      'yyyy-MM-dd'
    );
    this.timeData[`${this.timeType}Time`] = new Date(
      this.timeData[`${this.timeType}Day`]
    ).getTime();
    this.timeShow = false;
  }

  @Emit()
  confirm(o: object) {
    // console.log(o);
  }

  filterConfirm() {
    this.confirm(this.timeData);
  }
}
