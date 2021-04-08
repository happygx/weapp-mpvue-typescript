import { Vue, Component } from 'vue-property-decorator';
import { questions } from '@/api/question';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { now } from '@/utils/date';
import { UserModule } from '@/store/module/user';
import { refreshInit } from '@/utils/common';

@Component({
  name: 'mine',
  components: {
    Search,
    Filter,
    TableCom
  }
})
export default class Mine extends Vue {
  // data
  private roles: string = '';
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
    }
  ];
  private dropdownConfig: any[] = [
    {
      title: '状态',
      value: '',
      param: 'status',
      options: [
        { text: '全部', value: '' },
        { text: '新建', value: 10 },
        { text: '处理中', value: '20,30' },
        { text: '已处理', value: 40 },
        { text: '已关闭', value: 50 }
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
    this.roles = UserModule.info.group;
    if (this.roles === '售后经理') {
      this.dropdownConfig[0].options[1].value = '10,20';
      this.dropdownConfig[0].options[2].value = 30;
    }
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
    let data = {
      exhibitor_id: UserModule.info.id,
      min_create_time:
        this.timeConfig.startDay === '' ? '' : this.timeConfig.startDay + ` 00:00:00`,
      max_create_time: this.timeConfig.endDay + ` 23:59:59`,
      limit: 10
    };
    if (merge) {
      this.dataParams = Object.assign(this.dataParams, params);
    } else {
      this.dataParams = Object.assign(data, params);
    }

    questions({
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
    row.statusName = this.generateStatusType(row);
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
    if (row.status === 10 || (this.roles === '售后经理' && row.status === 20)) {
      row.click = () => {
        wx.navigateTo({
          url: `/pages/question/create/main?id=${row.id}`
        });
      };
    } else {
      row.click = () => {
        wx.navigateTo({
          url: `/pages/question/deal/main?id=${row.id}&view=true`
        });
      };
    }
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
}
