import { Vue, Component } from 'vue-property-decorator';
import { workflowSystemKeepRecords, wxWorkflowUpdate } from '@/api/work';
import { UserModule } from '@/store/module/user';

@Component({
  name: 'maintenance',
  components: {},
})
export default class Maintenance extends Vue {
  // data
  private maintenanceData: any[] = [];
  private isAll: boolean = false;
  private disabled: boolean = false;

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
    this.getMaintenance();
    if (UserModule.info.group === '养护员' || this.$mp.query.view === 'true') {
      this.disabled = true;
    }
  }

  getMaintenance() {
    workflowSystemKeepRecords({
      data: {
        workflow_id: this.$mp.query.id,
      },
    }).then((res: object) => {
      this.maintenanceData = JSON.parse(res[0].item);
      let hasFalse = this.maintenanceData.some((val) => {
        return val.status === false;
      });
      this.isAll = hasFalse ? false : true;
    });
  }

  checkAll(e: any) {
    this.isAll = e.mp.detail;
    this.maintenanceData.map((val) => {
      val.status = e.mp.detail;
    });
  }

  onSubmit() {
    wxWorkflowUpdate({
      method: 'PUT',
      data: {
        workflowId: this.$mp.query.id,
        operation: 121,
        item: JSON.stringify(this.maintenanceData),
      },
    }).then((res: any) => {
      wx.navigateBack();
    });
  }
}
