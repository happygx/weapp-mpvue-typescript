import { Vue, Component } from 'vue-property-decorator';
import {} from '@/api/common';
import { UserModule } from '@/store/module/user';

@Component({
  name: 'work',
  components: {},
})
export default class Work extends Vue {
  // data
  private browse: string[] = [];
  private page: object = {
    mineWorkflow: false,
    workflowList: false,
    workflowCreate: false,
  };

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
    this.browse = UserModule.browse;
    for (let item of Object.keys(this.page)) {
      this.page[item] = this.browse.includes(item);
    }
  }
}
