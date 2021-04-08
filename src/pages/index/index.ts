/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-02-25 16:36:31
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { UserModule } from '@/store/module/user';
import { questions } from '@/api/question';
import { now } from '@/utils/date';
import { mineWorkflowCount } from '@/api/work';

// 必须使用装饰器的方式来指定component
@Component({
  name: 'index',
  components: {}
})
export default class Index extends Vue {
  private bg1: string = require('@/assert/img/swiper1.png');
  private bg2: string = require('@/assert/img/swiper2.png');
  private roles: string = '';
  private browse: any = [];
  private page: any = {
    mineQuestion: false,
    upcoming: false,
    attention: false,
    questionList: false,
    questionCreate: false,
    questionSurvey: false,
    mineWorkflow: false,
    upcomingWorkflow: false,
    UpcomingConfirm: false,
    UpcomingDistribution: false,
    workflowList: false,
    workflowCreate: false,
    constructionSurvey: false,
    constructionList: false,
    constructionCreate: false
  };
  private questionUpcomingCount: number = 0;
  private mineWorkflowCountData: any = {};

  onLoad() {
    //
  }

  onShow() {
    // 小程序 hook
    this.init();
  }

  mounted() {
    // vue hook
  }

  init() {
    this.roles = UserModule.info.group;
    this.browse = UserModule.browse;
    if (this.browse.length > 0) {
      for (let item of Object.keys(this.page)) {
        this.page[item] = this.browse.includes(item);
      }
      if (this.roles === '养护员') {
        this.page.UpcomingConfirm = true;
        this.getMineWorkflowCount();
      } else if (this.roles === '运维') {
        this.getQuestionUpcoming();
      } else if (this.roles === '售后经理') {
        this.page.upcomingWorkflow = true;
        this.page.UpcomingConfirm = true;
        this.page.UpcomingDistribution = true;
        this.getQuestionUpcoming();
        this.getMineWorkflowCount();
      } else if (this.roles === '售后人员') {
        this.page.upcomingWorkflow = true;
        this.getMineWorkflowCount();
      }
    }
  }

  getQuestionUpcoming() {
    let state = this.roles === '运维' ? 10 : 20;
    questions({
      data: {
        min_create_time: '',
        max_create_time: `${now} 23:59:59`,
        limit: 1,
        status: state
      }
    }).then((res: any) => {
      this.questionUpcomingCount = res.count;
    });
  }

  getMineWorkflowCount() {
    mineWorkflowCount().then((res: any) => {
      this.mineWorkflowCountData = res;
    });
  }

  login() {
    wx.redirectTo({
      url: '/pages/login/main'
    });
  }
}
