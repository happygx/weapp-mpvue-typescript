import { Vue, Component } from 'vue-property-decorator';
import {} from '@/api/common';
import { UserModule } from '@/store/module/user';
import { questions } from '@/api/question';
import { now } from '@/utils/date';

@Component({
  name: 'question',
  components: {},
})
export default class Question extends Vue {
  // data
  private browse: string[] = [];
  private page: object = {
    mineQuestion: false,
    upcoming: false,
    attention: false,
    questionList: false,
    questionCreate: false,
  };
  private upcomingCount: number = 0;
  private mineCount: number = 0;

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
    for (let item of Object.keys(this.page)) {
      this.page[item] = this.browse.includes(item);
    }
    if (this.browse.length > 0) {
      this.getUpcoming();
      this.getMine();
    }
  }

  getUpcoming() {
    let state = UserModule.info.group === '运维' ? 10 : 20;
    questions({
      data: {
        min_create_time: '',
        max_create_time: now,
        limit: 1,
        status: state,
      },
    }).then((res: any) => {
      this.upcomingCount = res.count;
    });
  }

  getMine() {
    questions({
      data: {
        exhibitor_id: UserModule.info.id,
        min_create_time: '',
        max_create_time: now,
        limit: 1,
        status: '10,20,30,40',
      },
    }).then((res: any) => {
      this.mineCount = res.count;
    });
  }
}
