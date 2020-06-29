import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  name: 'tableCom',
})
export default class TableCom extends Vue {
  // prop
  @Prop({
    required: true,
    default: '',
  })
  private tableConfig: any;

  // data
  private tableData: any[] = [];

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
    //
  }

  handleSelection() {
    return this.tableConfig.tableData.filter((row: any) => {
      return row.checked;
    });
  }

  expansion(row: any) {
    row.isExpansion = !row.isExpansion;
    this.$forceUpdate();
  }

  checkedChange(row: any) {
    row.checked = !row.checked;
    this.$forceUpdate();
  }
}
