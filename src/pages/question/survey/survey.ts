import { Vue, Component } from 'vue-property-decorator';
import { buildings } from '@/api/common';
import { buildingQuestion } from '@/api/question';
import Company from '@/components/Company/company.vue';
import { now, minDate, maxDate, lastMonthDay } from '@/utils/date';
import { formatDate } from '@/utils/common';

@Component({
  name: 'survey',
  components: {
    Company,
  },
})
export default class Survey extends Vue {
  // data
  private companyShow: boolean = false;
  private componentShow: boolean = false;
  private buildingsData: object[] = [];
  private buildingName: string = '';
  private buildingId: number = 0;
  private timeConfig: any = {
    startDay: lastMonthDay,
    endDay: now,
    startTime: '',
    endTime: '',
    minDate: minDate,
    maxDate: maxDate,
  };
  private questionData: object = {};
  private classification: string[] = [];
  private popupShow: boolean = false;
  private timeShow: boolean = false;
  private timeType: string = '';

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
    this.timeConfig.startTime = new Date(this.timeConfig.startDay).getTime();
    this.timeConfig.endTime = new Date(this.timeConfig.endDay).getTime();
    this.getBuildings();
  }

  get defaultDate() {
    return this.timeType === 'start' ? this.timeConfig.startTime : this.timeConfig.endTime;
  }

  getBuildings() {
    buildings().then((res: any) => {
      this.buildingsData = res;
    });
  }

  selectBuilding(b: { name: string; id: number }) {
    this.buildingName = b.name;
    this.buildingId = b.id;
    console.log(this.timeConfig);
    this.getBuildingQuestion();
  }

  getBuildingQuestion() {
    buildingQuestion({
      data: {
        buildingId: this.buildingId,
        startTime: `${this.timeConfig.startDay} 00:00:00`,
        endTime: `${this.timeConfig.endDay} 00:00:00`,
      },
    }).then((res: object) => {
      this.questionData = res;
      this.classification = Object.keys(res);
    });
  }

  selectTime(type: string) {
    this.timeType = type;
    this.timeShow = true;
  }

  timeConfirm(val: any) {
    this.timeConfig[`${this.timeType}Day`] = formatDate(val.mp.detail, 'yyyy-MM-dd');
    this.timeConfig[`${this.timeType}Time`] = new Date(this.timeConfig[`${this.timeType}Day`]).getTime();
    this.timeShow = false;
  }

  popupConfirm() {
    this.getBuildingQuestion();
    this.popupShow = false;
  }
}
