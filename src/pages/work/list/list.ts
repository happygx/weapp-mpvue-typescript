import { Vue, Component } from 'vue-property-decorator';
import { workflows } from '@/api/work';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { now } from '@/utils/date';
import { workStatusType, refreshInit } from '@/utils/common';

@Component({
  name: 'list',
  components: {
    Search,
    Filter,
    TableCom
  }
})
export default class List extends Vue {
  // data
  // data
  private searchOptions: object[] = [
    {
      text: '请选择',
      param: ''
    },
    {
      text: '工单编号',
      param: 'code'
    },
    {
      text: '仓库名称',
      param: 'building_abbreviation'
    }
  ];
  private dropdownConfig: any[] = [
    {
      title: '类型',
      value: '',
      param: 'kind',
      options: [
        { text: '全部', value: '' },
        { text: '维修单', value: 10 },
        { text: '维保单', value: 20 },
        { text: '善后单', value: 30 },
        { text: '调试单', value: 40 }
      ]
    },
    {
      title: '状态',
      value: 30,
      param: 'status',
      options: [
        { text: '全部', value: '20,30,999' },
        { text: '处理中', value: 20 },
        { text: '已处理', value: 30 },
        { text: '已完结', value: 999 }
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
      { prop: 'last_handler_name', icon: 'icon-user' },
      { prop: 'last_handler_time', icon: 'icon-clock' },
      { prop: 'statusName', icon: 'icon-status' }
    ],
    isLoading: true,
    isMore: true,
    workflowType: { 10: '维修单', 20: '维保单', 30: '善后单', 40: '调试单' }
  };
  private curPage: number = 0;
  private dataParams: object = {};
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
        startTime: `${params.startDay} 00:00:00`,
        endTime: `${params.endDay} 23:59:59`
      };
    }
    this.getData(params, merge);
  }

  getData(params: any = {}, merge: boolean = false) {
    let data = {
      startTime: this.timeConfig.startDay === '' ? '' : this.timeConfig.startDay + ` 00:00:00`,
      endTime: this.timeConfig.endDay + ` 23:59:59`,
      status: '20,30,110,999',
      limit: 10
    };

    if (merge) {
      this.dataParams = Object.assign(this.dataParams, params);
    } else {
      this.dataParams = Object.assign(data, params);
    }

    workflows({
      data: this.dataParams
    }).then((res: any) => {
      for (let item of res.results) {
        item.statusName = workStatusType(item);
        item.click = () => {
          wx.navigateTo({
            url: `/pages/work/deal/main?id=${item.id}&view=true`
          });
        };
      }
      this.tableConfig.tableData = [...this.tableConfig.tableData, ...res.results];
      this.tableConfig.isLoading = false;
      this.tableConfig.isMore = this.isMoreLoading = res.next ? true : false;
      this.isRefresh = refreshInit(this.isRefresh);
    });
  }
}
