import { Vue, Component } from 'vue-property-decorator';
import { questionConcerns } from '@/api/question';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { now } from '@/utils/date';
import { questionStatusType, refreshInit } from '@/utils/common';

@Component({
  name: 'attention',
  components: {
    Search,
    Filter,
    TableCom
  }
})
export default class Attention extends Vue {
  // data
  private searchOptions: object[] = [
    {
      text: '请选择',
      param: ''
    },
    {
      text: '仓库名称',
      param: 'building_abbreviation'
    },
    {
      text: '问题分类',
      param: 'classification_name'
    },
    {
      text: '提出人',
      param: 'exhibitor_name'
    }
  ];
  private dropdownConfig: any[] = [
    {
      title: '阶段',
      value: '',
      param: 'concernStatus',
      options: [
        { text: '全部', value: '' },
        { text: '现在', value: 10 },
        { text: '历史', value: 20 }
      ]
    },
    {
      title: '级别',
      value: '',
      param: 'rank',
      options: [
        { text: '全部', value: '' },
        { text: '一般', value: 0 },
        { text: '紧急', value: 1 },
        { text: '非常紧急', value: 2 }
      ]
    }
  ];
  private timeConfig: any = {
    startDay: '',
    endDay: now
  };
  private tableConfig: any = {
    tableData: [],
    tableHeader: [
      { prop: 'exhibitor_name', icon: 'icon-user' },
      { prop: 'create_time', icon: 'icon-clock' },
      { prop: 'statusName', icon: 'icon-status' }
    ],
    isLoading: true,
    isMore: true,
    tagType: ['default', 'warning', 'danger']
  };
  private curPage: number = 0;
  private dataParams: any = {};
  private isRefresh: boolean = false;
  private isMoreLoading: boolean = false;
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

  // 初始化函数
  init() {
    this.getData();
  }

  generateData(params: any = {}, merge: boolean = false) {
    this.tableConfig.isLoading = true;
    this.tableConfig.tableData = [];
    this.curPage = 0;
    params.offset = 0;
    // 时间筛选因为属性值不一致需要单独赋值
    if (params.hasOwnProperty('startDay')) {
      params = {
        min_create_time: params.startDay + ` 00:00:00`,
        max_create_time: params.endDay + ` 23:59:59`
      };
    }
    this.getData(params, merge);
  }

  getData(params: any = {}, merge: boolean = false) {
    let dataParams = {
      min_create_time:
        this.timeConfig.startDay === '' ? '' : this.timeConfig.startDay + ` 00:00:00`,
      max_create_time: this.timeConfig.endDay + ` 23:59:59`,
      limit: 10
    };

    if (merge) {
      this.dataParams = Object.assign(this.dataParams, params);
    } else {
      this.dataParams = Object.assign(dataParams, params);
    }

    questionConcerns({
      data: this.dataParams
    }).then((res: any) => {
      for (let item of res.results) {
        this.handleRow(item);
      }
      this.tableConfig.tableData = [...this.tableConfig.tableData, ...res.results];
      this.tableConfig.isLoading = false;
      this.tableConfig.isMore = this.isMoreLoading = res.next ? true : false;
      this.isRefresh = refreshInit(this.isRefresh);
    });
  }

  handleRow(row: any) {
    row.statusName = questionStatusType(row);
    row.isEllipsis = row.content.length > 18;
    row.ellipsis = row.isEllipsis ? row.content.slice(0, 18) + '...' : row.content;
    row.operates = [
      {
        name: row.concern ? '取消' : '关注',
        clickFun: () => {
          if (row.concern) {
            (this as any).cancelAttention(row);
          } else {
            (this as any).attention(row);
          }
        }
      }
    ];
    row.click = () => {
      wx.navigateTo({
        url: `/pages/question/deal/main?id=${row.id}&view=true`
      });
    };
  }
}