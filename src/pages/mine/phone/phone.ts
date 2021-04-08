/*
 * @Description:
 * @Author: happy
 * @Date: 2020-12-14 10:10:31
 * @LastEditTime: 2021-04-01 17:16:01
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { buildings } from '@/api/common';

@Component({
  name: 'phone',
  components: {}
})
export default class Phone extends Vue {
  // data
  /* private tableConfig: any = {
    tableData: [],
    isLoading: true,
    isMore: true
  };
  private curPage: number = 0;
  private isMoreLoading: boolean = false;
  private dataParams: any = {}; */
  private search: string = '';
  private indexList: string[] = [];
  private customerList: object[] = [];

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
    this.getBuildings();
  }

  getBuildings(params?: object) {
    buildings({
      data: params
    }).then((res: any) => {
      let provinceList: any[] = [];
      for (let item of res) {
        provinceList.push(item.province);
      }
      provinceList = [...new Set(provinceList)];
      this.indexList = provinceList;

      for (let province of provinceList) {
        let obj: any = {};
        obj.province = province;
        let list: object[] = [];
        for (let item of res) {
          if (item.province === province) {
            list.push(item);
          }
        }
        obj.list = list;
        this.customerList.push(obj);
      }
    });
  }

  onSearch() {
    this.indexList = [];
    this.customerList = [];
    this.getBuildings({
      name: this.search
    });
    this.search = '';
  }

  detail(row: any) {
    wx.navigateTo({
      url: `/pages/mine/phone/detail/main?id=${row.id}&name=${row.name}`
    });
  }

  addPerson() {
    wx.navigateTo({
      url: `/pages/mine/phone/add/main`
    });
  }
}
