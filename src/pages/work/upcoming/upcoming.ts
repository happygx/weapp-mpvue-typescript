import { Vue, Component } from 'vue-property-decorator';
import { getAfterSalePerson, workflows, wxWorkflowUpdate } from '@/api/work';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { maxDate, minDate, now } from '@/utils/date';
import { UserModule } from '@/store/module/user';
import Dialog from '../../../../static/vant/dialog/dialog';

@Component({
  name: 'upcoming',
  components: {
    Search,
    Filter,
    TableCom,
  },
})
export default class Upcoming extends Vue {
  // data
  private roles: string = '';
  private searchOptions: object[] = [
    {
      text: '请选择',
      param: '',
    },
    {
      text: '工单编号',
      param: 'code',
    },
    {
      text: '仓库名称',
      param: 'building_name',
    },
  ];
  private dropdownConfig: any[] = [
    {
      title: '工单类型',
      value: '',
      options: [
        { text: '全部', value: '' },
        { text: '维修单', value: 10 },
        { text: '维保单', value: 20 },
        { text: '善后单', value: 30 },
        { text: '调试单', value: 40 },
      ],
      operate: (val: any) => {
        this.kindChange(val);
      },
    },
  ];
  private timeConfig: any = {
    startDay: '',
    endDay: now,
    minDate: minDate,
    maxDate: maxDate,
  };
  private tableConfig: any = {
    tableData: [],
    tableHeader: [
      { prop: 'last_handler_name', icon: 'icon-user' },
      { prop: 'last_handler_time', icon: 'icon-clock' },
      { prop: 'statusName', icon: 'icon-status' },
    ],
    isLoading: true,
    isMore: true,
    workflowType: { 10: '维修单', 20: '维保单', 30: '善后单', 40: '调试单' },
  };
  private curPage: number = 0;
  private dataParams: object = {};
  private isRefresh: boolean = false;
  private componentShow: boolean = false;
  private status: number = 100;
  private distributeShow: boolean = false;
  private distribute: any = {};
  private distributeData: object[] = [];

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

  // 下拉刷新
  onPullDownRefresh() {
    Object.assign(this.$data, this.$options.data());
    this.componentShow = true;
    this.isRefresh = true;
    this.init();
  }

  // 上拉加载
  onReachBottom() {
    if (this.tableConfig.isMore) {
      this.curPage++;
      this.getWorkflows();
    }
  }

  // 初始化函数
  init() {
    if (this.$mp.query.type === 'confirm') {
      wx.setNavigationBarTitle({
        title: '待您确认',
      });
      this.status = 400;
    } else if (this.$mp.query.type === 'upcoming') {
      wx.setNavigationBarTitle({
        title: '待办工单',
      });
      this.status = 200;
    }
    this.getWorkflows({}, true);
  }

  getWorkflows(params?: any, noMerge?: boolean) {
    if (params) {
      this.curPage = 0;
      this.tableConfig.tableData = [];
    }
    this.tableConfig.isLoading = true;
    let data = {
      startTime: this.timeConfig.startDay === '' ? '' : `${this.timeConfig.startDay} 00:00:00`,
      endTime: `${this.timeConfig.endDay} 23:59:59`,
      offset: 0 + this.curPage * 10,
      limit: 10,
      myselfStatus: this.status,
    };
    data = Object.assign(data, params);
    if (!noMerge) {
      this.dataParams = Object.assign(this.dataParams, data);
    } else {
      this.dataParams = data;
    }

    workflows({
      data: this.dataParams,
    }).then((res: any) => {
      for (let item of res.results) {
        this.getOperate(item);
        item.statusName = this.generateStatusType(item);
      }
      this.tableConfig.tableData = [...this.tableConfig.tableData, ...res.results];
      this.tableConfig.isLoading = false;
      if (this.isRefresh) {
        wx.stopPullDownRefresh({
          success: () => {
            this.isRefresh = false;
          },
        });
      }
      this.tableConfig.isMore = res.next ? true : false;
    });
  }

  getOperate(row: any) {
    let operate: object[] = [];
    let name = UserModule.info.name;
    // 最后处理人不是自己的都是查看
    if (row.last_receive_user === name) {
      if (row.exe_operations.includes('修改')) {
        row.click = () => {
          wx.navigateTo({
            url: `/pages/work/create/main?id=${row.id}`,
          });
        };
      }
      if (row.exe_operations.includes('关闭')) {
        operate.push({
          name: '删除',
          clickFun: () => {
            this.delete(row);
          },
        });
      }
      if (row.exe_operations.includes('分配')) {
        operate.push({
          name: '分配',
          clickFun: () => {
            this.distribution(row);
          },
        });
      }
      if (row.exe_operations.includes('处理') || row.exe_operations.includes('查看')) {
        row.click = () => {
          this.view(row.id);
        };
      }
    } else {
      row.click = () => {
        this.view(row.id);
      };
    }
    row.operates = operate;
  }

  generateStatusType(row: any) {
    switch (row.status) {
      case 10:
        return '新建';
      case 20:
        return '处理中';
      case 30:
        return '已处理';
      case 999:
        return '已完结';
    }
  }

  kindChange(e: any) {
    this.dropdownConfig[0].value = e.mp.detail;
    this.getWorkflows({
      kind: e.mp.detail,
    });
  }

  delete(row: any) {
    Dialog.confirm({
      message: '是否将此工单删除？',
    })
      .then(() => {
        wxWorkflowUpdate({
          method: 'PUT',
          data: {
            operation: 100,
            workflowId: row.id,
          },
        })
          .then((res: any) => {
            Object.assign(this.$data, this.$options.data());
            this.componentShow = true;
            this.init();
            this.$tip('工单删除成功！');
          })
          .catch(() => {
            // on cancel
          });
      })
      .catch(() => {
        // on cancel
      });
  }

  distribution(row: any) {
    this.distributeShow = true;
    this.distribute = row;
    getAfterSalePerson({
      data: {
        buildingId: row.building_id,
      },
    }).then((res: object[]) => {
      this.distributeData = res;
    });
  }

  distributeConfirm(e: any) {
    let questionsId: number[] = [];
    this.distribute.questions.forEach((item: any) => {
      questionsId.push(item.id);
    });
    wxWorkflowUpdate({
      method: 'PUT',
      data: {
        operation: 60,
        receiveUserId: e.target.value.id,
        questionsId: questionsId,
        workflowId: this.distribute.id,
      },
    }).then((res: any) => {
      Object.assign(this.$data, this.$options.data());
      this.componentShow = true;
      this.init();
      this.$tip('工单分配成功！');
    });
  }

  view(id: number) {
    wx.navigateTo({
      url: `/pages/work/deal/main?id=${id}`,
    });
  }

  filterConfirm(time: { startDay: string; endDay: string }) {
    this.timeConfig = time;
    this.$mp.page.selectComponent('#filter').toggle();
    this.getWorkflows({
      min_create_time: time.startDay === '' ? '' : time.startDay + ` 00:00:00`,
      max_create_time: time.endDay + ` 23:59:59`,
    });
  }
}
