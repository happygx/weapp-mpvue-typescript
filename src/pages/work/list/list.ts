import { Vue, Component } from 'vue-property-decorator';
import { workflows } from '@/api/work';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { now, minDate, maxDate } from '@/utils/date';

@Component({
  name: 'list',
  components: {
    Search,
    Filter,
    TableCom,
  },
})
export default class List extends Vue {
  // data
  // data
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
        { text: '处理中', value: 20 },
        { text: '已处理', value: 30 },
        { text: '已完结', value: 999 },
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
          : this.timeConfig.startDay + ` 00:00:00`,
      endTime: this.timeConfig.endDay + ` 23:59:59`,
      status: '20,30,110,999',
      offset: 0 + this.curPage * 10,
      limit: 10,
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
        item.statusName = this.generateStatusType(item);
        item.click = () => {
          wx.navigateTo({
            url: `/pages/work/deal/main?id=${item.id}&view=true`,
          });
        };
      }
      this.tableConfig.tableData = [
        ...this.tableConfig.tableData,
        ...res.results,
      ];

      this.tableConfig.isLoading = false;
      this.tableConfig.isMore = res.next ? true : false;
      if (this.isRefresh) {
        wx.stopPullDownRefresh({
          success: () => {
            this.isRefresh = false;
          },
        });
      }
    });
  }

  generateStatusType(row: any) {
    switch (row.status) {
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

  statusChange(e: any) {
    this.dropdownConfig[1].value = e.mp.detail;
    this.getWorkflows({
      status: e.mp.detail,
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
