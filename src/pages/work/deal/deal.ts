import { Vue, Component } from 'vue-property-decorator';
import { buildings } from '@/api/common';
import { workflows } from '@/api/work';

@Component({
  name: 'deal',
  components: {},
})
export default class Deal extends Vue {
  // data
  private isView: boolean = false;
  private workData: any = {};
  private recordShow: boolean = false;

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
    if (this.$mp.query.view === 'true') {
      this.isView = true;
    }
    this.getWorkData();
  }

  getWorkData() {
    workflows({
      url: `workflows/${this.$mp.query.id}`,
    }).then((res: any) => {
      console.log(res);
      this.workData = res;
    });
  }

  recordConfirm(content: string) {
    buildings({
      method: 'PUT',
      url: `buildings/${this.workData.buildingId}`,
      data: {
        record: content,
      },
    }).then(() => {
      this.workData.building_record = content;
      this.recordShow = false;
      this.$tip('仓库记录修改成功！');
    });
  }
}
