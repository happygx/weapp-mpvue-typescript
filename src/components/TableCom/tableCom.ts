/*
 * @Description:
 * @Author: happygx
 * @Date: 2020-07-03 17:18:53
 * @LastEditTime: 2021-03-11 10:25:50
 * @LastEditors: happy
 */
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  name: 'tableCom'
})
export default class TableCom extends Vue {
  // prop
  @Prop({
    required: true,
    default: ''
  })
  private tableConfig: any;

  // data
  private tableConfigData: any = {};
  private operates: object[] = [];
  private popupShow: boolean = false;

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
    this.tableConfigData = JSON.parse(JSON.stringify(this.tableConfig));
  }

  @Watch('tableConfig', { deep: true })
  onTableConfigChange(newVal: object) {
    this.tableConfigData = newVal;
    this.$forceUpdate();
  }

  onLongPress(item: any) {
    if (item.operates && item.operates.length > 0) {
      this.operates = item.operates;
      this.popupShow = true;
    }
  }

  popupOperate(operate: any) {
    this.popupShow = false;
    operate.clickFun();
  }

  handleSelection() {
    return this.tableConfigData.tableData.filter((row: any) => {
      return row.checked;
    });
  }

  expansion(row: any) {
    console.log(row);
    row.isExpansion = !row.isExpansion;
    this.$forceUpdate();
  }

  checkedChange(row: any) {
    row.checked = !row.checked;
    this.$forceUpdate();
  }
}
