import { buildingQuestion } from '@/api/question';
/*
 * @Description:
 * @Author: happy
 * @Date: 2020-12-17 15:29:19
 * @LastEditTime: 2021-04-01 17:24:52
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { addressBooks, locationUpdate } from '@/api/mine';
import Dialog from '../../../../../static/vant/dialog/dialog';

@Component({
  name: 'detail',
  components: {}
})
export default class Detail extends Vue {
  // data
  personData: any[] = [];
  buildingAddress: string = '';
  buildingName: string = '';
  buildingId: number = 0;

  // 监听页面加载
  onLoad() {
    this.init();
  }

  // 小程序 hook
  onShow() {
    this.buildingId && this.getPerson();
  }

  // vue hook
  mounted() {
    //
  }

  // 初始化函数
  init() {
    this.buildingId = this.$mp.query.id;
    this.buildingName = this.$mp.query.name;
    this.getPerson();
  }

  getPerson() {
    addressBooks({
      url: `addressBooks?building_id=${this.buildingId}`
    }).then((res: any) => {
      this.personData = res.results;
      this.buildingAddress = res.results[0].building_address;
    });
  }

  addPerson() {
    wx.navigateTo({
      url: `/pages/mine/phone/add/main?buildingId=${this.buildingId}&buildingName=${this.buildingName}`
    });
  }

  editPerson(id: number) {
    wx.navigateTo({
      url: `/pages/mine/phone/add/main?personId=${id}`
    });
  }

  deletePerson(id: number) {
    Dialog.confirm({
      message: '是否确定删除？'
    })
      .then(() => {
        addressBooks({
          method: 'DELETE',
          url: `addressBooks/${id}`
        }).then((res: any) => {
          this.getPerson();
          this.$tip('删除成功！');
        });
      })
      .catch(() => {
        // on cancel
      });
  }

  call(phone: string) {
    wx.makePhoneCall({
      phoneNumber: phone,
      success: res => {
        //
      }
    });
  }

  toMapApp() {
    wx.openLocation({
      latitude: this.personData[0].building_lat, // 纬度，范围为-90~90，负数表示南纬
      longitude: this.personData[0].building_lon, // 经度，范围为-180~180，负数表示西经
      scale: 8, // 缩放比例
      name: this.personData[0].building_name,
      address: this.personData[0].building_address,
      success: r => {
        console.log(r);
      }
    });
  }

  updateAddress(id: number) {
    wx.chooseLocation({
      success: res => {
        let data = Object.assign(res, {
          buildingId: this.buildingId
        });
        locationUpdate({
          method: 'PUT',
          data
        }).then((res: any) => {
          this.getPerson();
          this.$tip('仓库地址更新成功！');
        });
      }
    });
  }
}
