import { Vue, Component } from 'vue-property-decorator';
import {
  questionClassifications,
  workflowQuestionSolutions,
} from '@/api/question';
import { UserModule } from '@/store/module/user';
import Add from './Add/add.vue';

@Component({
  name: 'create',
  components: {
    Add,
  },
})
export default class Create extends Vue {
  // data
  private isTagsShow: boolean = false;
  private roles: string = '';
  private classificationsData: object[] = [];
  private solutionsData: object[] = [];
  private tabActive: number = 0;
  private collapseActive: number = 0;
  private classification: object = {};

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
    this.roles = UserModule.info.group;
    this.isTagsShow = this.roles === '养护员' ? true : false;
    if (this.$mp.query.id !== undefined) {
      this.isTagsShow = false;
      this.tabActive = 1;
    }
    this.getQuestionClassifications();
  }

  getQuestionClassifications() {
    questionClassifications().then((res: any) => {
      this.classificationsData = res;
    });
  }

  collapseChange(e: { mp: { detail: number } }) {
    this.collapseActive = e.mp.detail;
    this.getWorkflowQuestionSolutions();
  }

  getWorkflowQuestionSolutions() {
    this.solutionsData = [];
    workflowQuestionSolutions({
      data: {
        question_id: this.collapseActive,
      },
    }).then((res: any) => {
      this.solutionsData = res;
    });
  }

  tabChange(e: any) {
    if (e.target.index === 0) {
      this.tabActive = 0;
    }
  }

  create(item: object) {
    this.classification = item;
    this.tabActive = 1;
  }
}
