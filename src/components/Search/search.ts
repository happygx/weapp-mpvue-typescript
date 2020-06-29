import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component({
  name: 'search',
})
export default class Search extends Vue {
  // prop
  @Prop({
    required: false,
    default: [
      {
        text: '请选择',
        param: '',
      },
    ],
  })
  private searchOptions: object[];

  // data
  private searchShow: boolean = false;
  private searchRow: { text: string; param: string } = {
    text: '请选择',
    param: '',
  };
  private searchVal: string = '';

  // 小程序 hook
  onShow() {
    //
  }

  // vue hook
  mounted() {
    // console.log('search');
  }

  // 初始化函数
  init() {
    //
  }

  onSelect() {
    this.searchShow = true;
  }

  pickerCancel() {
    this.searchShow = false;
  }

  pickerConfirm(val: any) {
    // console.log(val);
    this.searchRow = val.mp.detail.value;
    this.pickerCancel();
  }

  @Emit()
  search(params: any, merge: boolean) {
    // console.log(params);
  }

  onSearch() {
    let search = {
      search_param: this.searchRow.param,
      search: this.searchVal,
    };
    this.search(search, true);
  }
}
