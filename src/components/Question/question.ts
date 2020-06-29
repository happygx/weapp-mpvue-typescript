import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { questions } from '@/api/question';
import TableCom from '../TableCom/tableCom.vue';

@Component({
  name: 'question',
  components: {
    TableCom,
  },
})
export default class Question extends Vue {
  // prop
  @Prop({
    required: true,
  })
  private buildingId: number;
  @Prop({
    required: true,
  })
  private selectRows: any[];

  // data
  private tableConfig: any = {
    tableData: [],
    tableHeader: [
      { prop: 'exhibitor_name', icon: 'icon-user' },
      { prop: 'create_time', icon: 'icon-clock' },
      { prop: 'visibleName', icon: 'icon-status' },
    ],
    tagType: ['default', 'warning', 'danger'],
    isLoading: true,
    isMore: false,
    checkbox: true,
  };

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
    this.getQuestions();
  }

  getQuestions() {
    questions({
      data: {
        building_id: this.buildingId,
        status: 20,
      },
    }).then((res: any) => {
      for (let item of res.results) {
        item.visibleName = item.visible ? '可见' : '不可见';
        if (item.content.length >= 16) {
          item.ellipsis = item.content.slice(0, 16) + '...';
        }
        if (this.selectRows.length > 0) {
          for (let row of this.selectRows) {
            if (item.id === row.id) {
              item.checked = true;
            }
          }
        }
      }
      this.tableConfig.tableData = res.results;
      this.tableConfig.isLoading = false;
    });
  }

  @Emit()
  cancel() {}

  @Emit()
  confirm(selectRows: []) {}

  addQuestion() {
    let selectRows = this.$refs.table.handleSelection();
    if (selectRows.length > 0) {
      this.confirm(selectRows);
      this.cancel();
    } else {
      this.$tip('请选择问题！');
    }
  }
}
