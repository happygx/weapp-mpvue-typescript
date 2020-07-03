import { Vue, Component } from 'vue-property-decorator';
import { workflows, wxWorkflowUpdate, getAfterSalePerson } from '@/api/work';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { UserModule } from '@/store/module/user';
import { now, minDate, maxDate } from '@/utils/date';
import Dialog from '../../../../static/vant/dialog/dialog';

@Component({
  name: 'mine',
  components: {
    Search,
    Filter,
    TableCom,
  },
})
export default class Mine extends Vue {
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
      ],
      operate: (val: any) => {
        this.kindChange(val);
      },
    },
    {
      title: '状态',
      value: '',
      options: [
        { text: '全部', value: '' },
        { text: '待您确认', value: 400 },
        { text: '已完结', value: 600 },
      ],
      operate: (val: any) => {
        this.statusChange(val);
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
    workflowType: { 10: '维修单', 20: '维保单', 30: '善后单' },
  };
  private curPage: number = 0;
  private dataParams: object = {};
  private isRefresh: boolean = false;
  private distributeShow: boolean = false;
  private distributeData: object[] = [];
  private distribute: any = {};
  private componentShow: boolean = false;

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
    this.roles = UserModule.info.group;
    if (this.roles === '售后经理') {
      this.dropdownConfig[1].options = [
        { text: '新建', value: 100 },
        { text: '我的待办', value: 200 },
        { text: '处理中', value: 300 },
        { text: '待您确认', value: 400 },
        { text: '已处理', value: 500 },
        { text: '已完结', value: 600 },
      ];
    } else if (this.roles === '售后人员') {
      this.dropdownConfig[1].options = [
        { text: '我的待办', value: 200 },
        { text: '已完结', value: 600 },
      ];
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
      startTime:
        this.timeConfig.startDay === ''
          ? ''
          : `${this.timeConfig.startDay} 00:00:00`,
      endTime: `${this.timeConfig.endDay} 23:59:59`,
      offset: 0 + this.curPage * 10,
      limit: 10,
    };
    // if (this.isRefresh) {
    //   let time = {
    //     startTime: '',
    //     endTime: `${now} 23:59:59`,
    //   };
    //   data = Object.assign(data, time);
    // }
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
      this.tableConfig.tableData = [
        ...this.tableConfig.tableData,
        ...res.results,
      ];
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
      if (row.exe_operations.includes('处理')) {
        row.click = () => {
          this.view(row.id);
        };
      }
      if (row.exe_operations.includes('查看')) {
        row.click = () => {
          this.view(row.id, true);
        };
      }
    } else {
      row.click = () => {
        this.view(row.id, true);
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

  delete(row: any) {
    Dialog.confirm({
      message: '是否将此工单删除？',
    })
      .then(() => {
        let questions_id: number[] = [];
        row.questions.forEach((item: { id: number }) => {
          questions_id.push(item.id);
        });
        wxWorkflowUpdate({
          method: 'PUT',
          data: {
            operation: 100,
            workflowId: row.id,
            questionsId: questions_id,
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

  view(id: number, b?: boolean) {
    wx.navigateTo({
      url: `/pages/work/deal/main?id=${id}&view=${b}`,
    });
  }

  kindChange(e: any) {
    this.dropdownConfig[0].value = e.mp.detail;
    this.getWorkflows({
      kind: e.mp.detail,
    });
  }

  statusChange(e: any) {
    this.dropdownConfig[1].value = e.mp.detail;
    this.getWorkflows({
      myselfStatus: e.mp.detail,
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
