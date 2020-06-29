import { Vue, Component } from 'vue-property-decorator';
import { questions } from '@/api/question';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { now, minDate, maxDate } from '@/utils/date';
import { UserModule } from '@/store/module/user';

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
      text: '仓库名称',
      param: 'building_name',
    },
    {
      text: '问题分类',
      param: 'classification_name',
    },
  ];
  private dropdownConfig: any[] = [
    {
      title: '状态',
      value: '',
      options: [
        { text: '全部', value: '' },
        { text: '新建', value: 10 },
        { text: '处理中', value: '20,30' },
        { text: '已处理', value: 40 },
        { text: '已关闭', value: 50 },
      ],
      operate: (val: any) => {
        this.statusChange(val);
      },
    },
    {
      title: '级别',
      value: '',
      options: [
        { text: '全部', value: '' },
        { text: '一般', value: 0 },
        { text: '紧急', value: 1 },
        { text: '非常紧急', value: 2 },
      ],
      operate: (val: any) => {
        this.rankChange(val);
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
      { prop: 'exhibitor_name', icon: 'icon-user' },
      { prop: 'create_time', icon: 'icon-clock' },
      { prop: 'statusName', icon: 'icon-status' },
    ],
    isLoading: true,
    isMore: true,
    tagType: ['default', 'warning', 'danger'],
  };
  private curPage: number = 0;
  private dataParams: object = {};
  private isRefresh: boolean = false;

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
    this.isRefresh = true;
    this.init();
  }

  // 上拉加载
  onReachBottom() {
    if (this.tableConfig.isMore) {
      this.curPage++;
      this.getQuestions();
    }
  }

  // 初始化函数
  init() {
    this.roles = UserModule.info.group;
    if (this.roles === '售后经理') {
      this.dropdownConfig[0].options[1].value = '10,20';
      this.dropdownConfig[0].options[2].value = 30;
    }
    this.getQuestions({}, true);
  }

  getQuestions(params?: any, noMerge?: boolean) {
    if (params) {
      this.curPage = 0;
      this.tableConfig.tableData = [];
    }
    this.tableConfig.isLoading = true;
    let data = {
      exhibitor_id: UserModule.info.id,
      min_create_time:
        this.timeConfig.startDay === ''
          ? ''
          : this.timeConfig.startDay + ` 00:00:00`,
      max_create_time: this.timeConfig.endDay + ` 23:59:59`,
      offset: 0 + this.curPage * 10,
      limit: 10,
    };

    data = Object.assign(data, params);
    if (!noMerge) {
      this.dataParams = Object.assign(this.dataParams, data);
    } else {
      this.dataParams = data;
    }

    questions({
      data: this.dataParams,
    }).then((res: any) => {
      for (let item of res.results) {
        if (
          item.status === 10 ||
          (this.roles === '售后经理' && item.status === 20)
        ) {
          item.click = () => {
            this.modify(item.id);
          };
        } else {
          item.click = () => {
            this.view(item.id);
          };
        }
        item.statusName = this.generateStatusType(item);
        if (item.content.length >= 16) {
          item.ellipsis = item.content.slice(0, 16) + '...';
        }
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
    if (this.roles === '售后经理') {
      switch (row.status) {
        case 10:
          return '新建';
        case 20:
          return '新建';
        case 30:
          return '处理中';
        case 40:
          return '已处理';
        case 50:
          return '已关闭';
      }
    } else {
      switch (row.status) {
        case 10:
          return '新建';
        case 20:
          return '处理中';
        case 30:
          return '处理中';
        case 40:
          return '已处理';
        case 50:
          return '已关闭';
      }
    }
  }

  modify(id: number) {
    wx.navigateTo({
      url: `/pages/question/create/main?id=${id}`,
    });
  }

  view(id: number) {
    wx.navigateTo({
      url: `/pages/question/deal/main?id=${id}&view=true`,
    });
  }

  statusChange(val: any) {
    this.dropdownConfig[0].value = val.mp.detail;
    this.getQuestions({
      status: val.mp.detail,
    });
  }

  rankChange(val: any) {
    this.dropdownConfig[1].value = val.mp.detail;
    this.getQuestions({
      rank: val.mp.detail,
    });
  }

  filterConfirm(time: { startDay: string; endDay: string }) {
    this.timeConfig = time;
    this.$mp.page.selectComponent('#filter').toggle();
    this.getQuestions({
      min_create_time: time.startDay === '' ? '' : time.startDay + ` 00:00:00`,
      max_create_time: time.endDay + ` 23:59:59`,
    });
  }
}
