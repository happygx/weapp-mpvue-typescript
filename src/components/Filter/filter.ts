/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:53
 * @LastEditTime: 2021-03-10 10:55:53
 * @LastEditors: happy
 */
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { formatDate } from '@/utils/common';
import { maxDate, minDate } from '@/utils/date';

@Component({
  name: 'filter'
})
export default class Filter extends Vue {
  // prop
  @Prop({
    required: true
  })
  private dropdownConfig: object[];
  @Prop({
    required: true
  })
  private timeConfig: object;

  // data
  private dropdownData: any = {};
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
    this.dropdownData = JSON.parse(JSON.stringify(this.dropdownConfig)); // 深拷贝常用方法
    this.timeData = JSON.parse(JSON.stringify(this.timeConfig)); // 深拷贝常用方法
    this.timeData = Object.assign(this.timeData, {
      startTime: new Date(this.timeData.startDay).getTime(),
      endTime: new Date(this.timeData.endDay).getTime(),
      minDate,
      maxDate
    });
    // console.log(this.timeData);
  }

  @Watch('dropdownConfig', { deep: true })
  onDropdownChange(newVal: any) {
    this.dropdownData = JSON.parse(JSON.stringify(newVal));
  }

  @Emit()
  filter(params: object = {}, merge: boolean = false) {
    // console.log(o);
  }

  dropdownFilter(e: any, i: number) {
    this.dropdownData[i].value = e.mp.detail;
    this.filter(
      {
        [this.dropdownData[i].param]: e.mp.detail
      },
      true
    );
  }

  get defaultDate() {
    let date = this.timeType === 'start' ? this.timeData.startTime : this.timeData.endTime;
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
    this.timeData[`${this.timeType}Day`] = formatDate(val.mp.detail, 'yyyy-MM-dd');
    this.timeData[`${this.timeType}Time`] = new Date(
      this.timeData[`${this.timeType}Day`]
    ).getTime();
    this.timeShow = false;
  }

  filterConfirm() {
    this.$parent.$mp.page.selectComponent('#filter').toggle();
    this.filter(this.timeData, true);
  }
}
