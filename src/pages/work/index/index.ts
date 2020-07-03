import { Vue, Component } from 'vue-property-decorator';
import { UserModule } from '@/store/module/user';
import { workflows } from '@/api/work';
import { now } from '@/utils/date';

@Component({
  name: 'work',
  components: {},
})
export default class Work extends Vue {
  // data
  private browse: any = [];
  private page: object = {
    mineWorkflow: false,
    workflowList: false,
    workflowCreate: false,
  };
  private upcomingCount: number = 0;

  // 监听页面加载
  onLoad() {
    //
  }

  // 小程序 hook
  onShow() {
    this.init();
  }

  // vue hook
  mounted() {
    //
  }

  // 初始化函数
  init() {
    this.browse = UserModule.browse;
    if (this.browse) {
      for (let item of Object.keys(this.page)) {
        this.page[item] = this.browse.includes(item);
      }
      if (this.browse.length > 0) {
        this.getUpcoming();
      }
    }
  }

  getUpcoming() {
    workflows({
      data: {
        startTime: '',
        endTime: now,
        limit: 1,
        myselfStatus: 200,
      },
    }).then((res: any) => {
      this.upcomingCount = res.count;
    });
  }

  login() {
    wx.navigateTo({
      url: '/pages/login/main',
    });
  }
}
