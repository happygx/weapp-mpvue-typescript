import { Vue, Component } from 'vue-property-decorator';
import { questionConcerns, concernDel } from '@/api/question';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { now, minDate, maxDate } from '@/utils/date';
import { UserModule } from '@/store/module/user';

@Component({
  name: 'attention',
  components: {
    Search,
    Filter,
    TableCom,
  },
})
export default class Attention extends Vue {
  // data
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
    {
      text: '提出人',
      param: 'exhibitor_name',
    },
  ];
  private dropdownConfig: any[] = [
    {
      title: '阶段',
      value: '',
      options: [
        { text: '全部', value: '' },
        { text: '现在', value: 10 },
        { text: '历史', value: 20 },
      ],
      operate: (val: any) => {
        this.stageChange(val);
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
  private dataParams: any = {
    concernStatus: '',
  };
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
      this.getQuestions();
    }
  }

  // 初始化函数
  init() {
    this.getQuestions({}, true);
  }

  getQuestions(params?: any, noMerge?: boolean) {
    if (params) {
      this.curPage = 0;
      this.tableConfig.tableData = [];
    }
    this.tableConfig.isLoading = true;
    let data = {
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

    questionConcerns({
      data: this.dataParams,
    }).then((res: any) => {
      for (let item of res.results) {
        item.statusName = this.generateStatusType(item);
        item.operates = [
          {
            name: item.concern ? '取消' : '关注',
            clickFun: () => {
              if (item.concern) {
                this.cancelAttention(item);
              } else {
                this.attention(item);
              }
            },
          },
        ];
        item.click = () => {
          this.view(item.id);
        };
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
    switch (row.status) {
      case 10:
        return '预处理';
      case 20:
        return '待处理';
      case 30:
        return '处理中';
      case 40:
        return '已处理';
      case 50:
        return '已关闭';
    }
  }

  stageChange(val: any) {
    this.dropdownConfig[0].value = val.mp.detail;
    this.getQuestions({
      concernStatus: val.mp.detail,
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

  attention(row: any) {
    questionConcerns({
      method: 'POST',
      data: {
        questionId: row.id,
      },
    }).then((res: any) => {
      row.operates[0].name = '取消';
      row.concern = true;
      this.$tip('关注成功！');
    });
  }

  cancelAttention(row: any) {
    concernDel({
      data: {
        questionId: row.id,
      },
    }).then((res: any) => {
      row.operates[0].name = '关注';
      row.concern = false;
      this.$tip('取消成功！');
    });
  }

  view(id: number) {
    wx.navigateTo({
      url: `/pages/question/deal/main?id=${id}&view=true`,
    });
  }
}
