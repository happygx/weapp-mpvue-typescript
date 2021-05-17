import { Vue, Component } from 'vue-property-decorator';
import { workflows, wxWorkflowUpdate, getAfterSalePerson, workflowProvince } from '@/api/work';
import Search from '@/components/Search/search.vue'; // mpvue目前只支持的单文件组件
import Filter from '@/components/Filter/filter.vue'; // mpvue目前只支持的单文件组件
import TableCom from '@/components/TableCom/tableCom.vue'; // mpvue目前只支持的单文件组件
import { UserModule } from '@/store/module/login';
import { now } from '@/utils/date';
import Dialog from '../../../../static/vant/dialog/dialog';
import { workStatusType, refreshInit } from '@/utils/common';

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
      title: '省份',
      value: '',
      param: 'province',
      options: [{ text: '全部', value: '' }]
    },
    {
      title: '类型',
      value: '',
      param: 'kind',
      options: [
        { text: '全部', value: '' },
        { text: '维修单', value: 10 },
        { text: '维保单', value: 20 },
        { text: '服务单', value: 30 },
        { text: '调试单', value: 40 }
      ]
    },
    {
      title: '状态',
      value: '000',
      param: 'myselfStatus',
      options: [
        { text: '全部', value: '000' },
        { text: '待您分配', value: 100 },
        { text: '待办工单', value: 200 },
        { text: '待您确认', value: 400 },
        { text: '已完结', value: 600 }
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
    checkbox: false,
    workflowType: { 10: '维修单', 20: '维保单', 30: '服务单', 40: '调试单' }
  };
  private curPage: number = 0;
  private myselfStatus: number | string = '000';
  private dataParams: object = {};
  private isRefresh: boolean = false;
  private isMoreLoading: boolean = false;
  private distributeShow: boolean = false;
  private distributePersonnelData: object[] = [];
  private distributeRow: any = {};
  private componentShow: boolean = false;
  private checked: boolean = false;
  private isFooter: boolean = false;

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
    this.dropdownInit();
    this.getData();
    this.getWorkflowProvince();
  }

  dropdownInit() {
    if (this.$mp.query.type === 'distribution') {
      this.myselfStatus = this.dropdownConfig[2].value = 100;
      this.isFooter = true;
      this.tableConfig.checkbox = true;
    } else if (this.$mp.query.type === 'upcoming') {
      this.myselfStatus = this.dropdownConfig[2].value = 200;
    } else if (this.$mp.query.type === 'confirm') {
      this.myselfStatus = this.dropdownConfig[2].value = 400;
    }
    if (this.roles === '养护员') {
      this.dropdownConfig[0].options.pop();
      this.dropdownConfig[0].options.pop();
    } else if (this.roles === '售后经理') {
      this.dropdownConfig[1].options = [
        { text: '全部', value: '000' },
        { text: '新建', value: 100 },
        { text: '我的待办', value: 200 },
        { text: '处理中', value: 300 },
        { text: '待您确认', value: 400 },
        { text: '已处理', value: 500 },
        { text: '已完结', value: 600 }
      ];
    } else if (this.roles === '售后人员') {
      this.dropdownConfig[1].options = [
        { text: '全部', value: '000' },
        { text: '我的待办', value: 200 },
        { text: '已处理', value: 500 },
        { text: '已完结', value: 600 }
      ];
    }
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
    if (params.myselfStatus) {
      if (params.myselfStatus === 100) {
        this.isFooter = true;
        this.tableConfig.checkbox = true;
      } else {
        this.isFooter = false;
        this.tableConfig.checkbox = false;
      }
    }

    let data = {
      startTime: this.timeConfig.startDay === '' ? '' : `${this.timeConfig.startDay} 00:00:00`,
      endTime: `${this.timeConfig.endDay} 23:59:59`,
      limit: 10,
      myselfStatus: this.myselfStatus
    };
    if (merge) {
      this.dataParams = Object.assign(this.dataParams, params);
    } else {
      this.dataParams = Object.assign(data, params);
    }

    workflows({
      data: this.dataParams
    }).then((res: any) => {
      res.results.forEach((item: any, i: number) => {
        this.handleRow(item, i);
      });
      this.tableConfig.tableData = [...this.tableConfig.tableData, ...res.results];
      this.tableConfig.isLoading = false;
      this.isRefresh = refreshInit(this.isRefresh);
      this.tableConfig.isMore = this.isMoreLoading = res.next ? true : false;
    });
  }

  getWorkflowProvince() {
    workflowProvince({
      data: {
        startTime: this.timeConfig.startDay === '' ? '' : `${this.timeConfig.startDay} 00:00:00`,
        endTime: `${this.timeConfig.endDay} 23:59:59`,
        myselfStatus: this.myselfStatus
      }
    }).then((res: any) => {
      for (let item of res) {
        this.dropdownConfig[0].options.push({ text: item, value: item });
      }
    });
  }

  handleRow(row: any, index: number) {
    let operate: object[] = [];
    let name = UserModule.info.name;
    // 最后处理人不是自己的都是查看
    if (row.last_receive_user === name) {
      if (row.exe_operations.includes('修改')) {
        row.click = () => {
          wx.navigateTo({
            url: `/pages/work/create/main?id=${row.id}`
          });
        };
      }
      if (row.exe_operations.includes('关闭')) {
        operate.push({
          name: '删除',
          clickFun: () => {
            this.delete(row);
          }
        });
      }
      if (row.exe_operations.includes('分配')) {
        operate.push({
          name: '分配',
          clickFun: () => {
            this.distribution(row);
          }
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
    row.statusName = workStatusType(row);
  }

  delete(row: any) {
    Dialog.confirm({
      message: '是否将此工单删除？'
    })
      .then(() => {
        wxWorkflowUpdate({
          method: 'PUT',
          data: {
            operation: 100,
            workflowId: row.id
          }
        }).then((res: any) => {
          this.tableConfig.tableData = this.tableConfig.tableData.filter(
            (item: { id: any }) => item.id !== row.id
          );
          this.$tip('工单删除成功！');
        });
      })
      .catch(() => {
        // on cancel
      });
  }

  distribution(row: any) {
    this.distributeShow = true;
    this.distributeRow = row;
    this.getAfterSalePerson();
  }

  getAfterSalePerson() {
    let buildingId = '';
    if (Array.isArray(this.distributeRow)) {
      for (let item of this.distributeRow) {
        buildingId += `${item.building_id},`;
      }
    } else {
      buildingId = this.distributeRow.building_id;
    }
    getAfterSalePerson({
      data: {
        buildingId
      }
    }).then((res: object[]) => {
      this.distributePersonnelData = res;
    });
  }

  distributeConfirm(e: any) {
    this.distributeShow = false;
    let workflowId: number[] = [];
    if (Array.isArray(this.distributeRow)) {
      for (let item of this.distributeRow) {
        workflowId.push(item.id);
      }
    } else {
      workflowId = this.distributeRow.id;
    }
    wxWorkflowUpdate({
      method: 'PUT',
      data: {
        operation: 60,
        receiveUserId: e.target.value.id,
        workflowId
      }
    }).then((res: any) => {
      this.generateData();
      this.$tip('工单分配成功！');
    });
  }

  checkedAll() {
    this.checked = !this.checked;
    for (let item of this.tableConfig.tableData) {
      item.checked = !item.checked;
    }
  }

  distributeAll() {
    this.distributeRow = (this.$refs.table as any).handleSelection();
    this.distributeShow = true;
    this.getAfterSalePerson();
  }

  view(id: number) {
    wx.navigateTo({
      url: `/pages/work/deal/main?id=${id}`
    });
  }
}
