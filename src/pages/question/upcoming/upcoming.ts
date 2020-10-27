import { Vue, Component } from 'vue-property-decorator';
import { questions, closeQuestion, questionConcerns, concernDel } from '@/api/question';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { now, minDate, maxDate } from '@/utils/date';
import { UserModule } from '@/store/module/user';

@Component({
  name: 'upcoming',
  components: {
    Search,
    Filter,
    TableCom,
    Popup,
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
      title: '区域',
      value: '',
      options: [
        { text: '全部', value: '' },
        { text: '浙江', value: 10 },
        { text: '湖南', value: 20 },
      ],
      operate: (val: any) => {
        this.regionChange(val);
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
      { prop: 'rangeName', icon: 'icon-region' },
    ],
    isLoading: true,
    isMore: true,
    checkbox: true,
    tagType: ['default', 'warning', 'danger'],
  };
  private curPage: number = 0;
  private dataParams: any = {};
  private isRefresh: boolean = false;
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
    this.roles = UserModule.info.group;
    this.getQuestions({}, true);
  }

  getQuestions(params?: any, noMerge?: boolean) {
    if (params) {
      this.curPage = 0;
      this.tableConfig.tableData = [];
    }
    this.tableConfig.isLoading = true;
    let data = {
      min_create_time: this.timeConfig.startDay === '' ? '' : this.timeConfig.startDay + ` 00:00:00`,
      max_create_time: this.timeConfig.endDay + ` 23:59:59`,
      offset: 0 + this.curPage * 10,
      limit: 10,
      status: this.roles === '运维' ? 10 : 20,
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
        item.rangeName = item.building_range === 10 ? '浙江' : '湖南';
        item.operates = [
          {
            name: '关闭',
            clickFun: () => {
              this.close(item);
            },
          },
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
          this.deal(item.id);
        };
        if (item.content.length >= 16) {
          item.ellipsis = item.content.slice(0, 16) + '...';
        }
      }
      this.tableConfig.tableData = [...this.tableConfig.tableData, ...res.results];

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

  regionChange(val: any) {
    this.dropdownConfig[0].value = val.mp.detail;
    this.getQuestions({
      building_range: val.mp.detail,
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
      row.operates[1].name = '取消';
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
      row.operates[1].name = '关注';
      row.concern = false;
      this.$tip('取消成功！');
    });
  }

  deal(id: number) {
    wx.navigateTo({
      url: `/pages/question/deal/main?id=${id}`,
    });
  }

  close(row: any) {
    this.closeQuestion = row;
    this.closeShow = true;
  }

  closeConfirm(content: string) {
    closeQuestion({
      method: 'POST',
      data: {
        questionId: this.closeQuestion.id,
        content: content,
      },
    }).then((result: any) => {
      this.closeShow = false;
      Object.assign(this.$data, this.$options.data());
      this.componentShow = true;
      this.init();
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
    let questions = this.$refs.table.handleSelection();
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
          url: `/pages/work/create/main?questions=${encodeURIComponent(JSON.stringify(questions))}`,
        });
      }
    }
  }
}
