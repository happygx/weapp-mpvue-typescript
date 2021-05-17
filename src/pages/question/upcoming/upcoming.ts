import { Vue, Component } from 'vue-property-decorator';
import { questions, closeQuestion } from '@/api/question';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { now } from '@/utils/date';
import { UserModule } from '@/store/module/login';
import { refreshInit } from '@/utils/common';

@Component({
  name: 'upcoming',
  components: {
    Search,
    Filter,
    TableCom,
    Popup
  }
})
export default class Upcoming extends Vue {
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
    },
    {
      text: '提出人',
      param: 'exhibitor_name'
    }
  ];
  private dropdownConfig: any[] = [
    {
      title: '区域',
      value: '',
      param: 'building_range',
      options: [
        { text: '全部', value: '' },
        { text: '浙江', value: 10 },
        { text: '湖南', value: 20 }
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
      { prop: 'rangeName', icon: 'icon-region' }
    ],
    isLoading: true,
    isMore: false,
    checkbox: true,
    tagType: ['default', 'warning', 'danger']
  };
  private curPage: number = 0;
  private dataParams: any = {};
  private isRefresh: boolean = false;
  private isMoreLoading: boolean = false;
  private closeShow: boolean = false;
  private closeQuestion: any = {};
  private componentShow: boolean = false;
  private checked: boolean = false;

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

  getData(params: object = {}, merge: boolean = false) {
    let data = {
      min_create_time:
        this.timeConfig.startDay === '' ? '' : this.timeConfig.startDay + ` 00:00:00`,
      max_create_time: this.timeConfig.endDay + ` 23:59:59`,
      status: this.roles === '运维' ? 10 : 20,
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
    row.rangeName = row.building_range === 10 ? '浙江' : '湖南';
    row.isEllipsis = row.content.length > 16;
    row.ellipsis = row.isEllipsis ? row.content.slice(0, 16) + '...' : row.content;
    row.operates = [
      {
        name: row.concern ? '取消关注' : '关注',
        clickFun: () => {
          if (row.concern) {
            (this as any).cancelAttention(row);
          } else {
            (this as any).attention(row);
          }
        }
      },
      {
        name: '关闭',
        clickFun: () => {
          this.close(row);
        }
      }
    ];
    row.click = () => {
      this.deal(row.id);
    };
  }

  deal(id: number) {
    wx.navigateTo({
      url: `/pages/question/deal/main?id=${id}`
    });
  }

  close(row: any) {
    this.closeQuestion = row;
    this.closeShow = true;
  }

  closeConfirm(content: string) {
    this.closeShow = false;
    closeQuestion({
      method: 'POST',
      data: {
        questionId: this.closeQuestion.id,
        content: content
      }
    }).then((result: any) => {
      this.generateData();
      this.$tip('关闭问题成功！');
    });
  }

  checkedAll() {
    this.checked = !this.checked;
    for (let item of this.tableConfig.tableData) {
      item.checked = !item.checked;
    }
  }

  createWork() {
    let questions = (this.$refs.table as any).handleSelection();
    if (questions.length === 0) {
      this.$tip('请选择问题！');
    } else {
      let buildingArr: string[] = [];
      for (let item of questions) {
        if (!buildingArr.includes(item.building_abbreviation)) {
          buildingArr.push(item.building_abbreviation);
        }
      }
      if (buildingArr.length > 1) {
        this.$tip('请选择同一仓库的问题！');
      } else {
        wx.navigateTo({
          url: `/pages/work/create/main?questions=${encodeURIComponent(JSON.stringify(questions))}`
        });
      }
    }
  }
}
