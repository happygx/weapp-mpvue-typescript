import { Vue, Component } from 'vue-property-decorator';
import {} from '@/api/common';
import { UserModule } from '@/store/module/user';

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
  }
}
