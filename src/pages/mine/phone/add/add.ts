/*
 * @Description:
 * @Author: happy
 * @Date: 2020-12-15 11:29:31
 * @LastEditTime: 2021-04-01 17:23:47
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { addressBooks } from '@/api/mine';

@Component({
  name: 'add',
  components: {}
})
export default class Add extends Vue {
  // data
  private buildingName: string = '';
  private buildingId: any = 0;
  private name: string = '';
  private mobile: string = '';
  private kind: number = 10;

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
    if (this.$mp.query.personId) {
      this.getPerson();
    } else {
      this.buildingId = this.$mp.query.buildingId;
      this.buildingName = this.$mp.query.buildingName;
    }
  }

  getPerson() {
    addressBooks({
      url: `addressBooks/${this.$mp.query.personId}`
    }).then((res: any) => {
      this.buildingName = res.building_name;
      this.buildingId = res.building_id;
      this.name = res.name;
      this.mobile = res.mobile;
      this.kind = res.kind;
    });
  }

  onSubmit() {
    if (this.buildingId && this.name && this.mobile) {
      // let reg = /^1([3-9])[0-9]{9}$/;
      // if (!reg.test(this.mobile)) {
      //   this.$tip('请输入正确的手机号');
      //   return false;
      // }
      this.$mp.query.personId ? this.modifyPerson() : this.addPerson();
    } else {
      this.$tip('不能为空！');
    }
  }

  addPerson() {
    addressBooks({
      method: 'POST',
      data: {
        building_id: this.buildingId,
        name: this.name,
        mobile: this.mobile,
        kind: this.kind
      }
    }).then((res: any) => {
      wx.navigateBack({
        delta: 1,
        success: () => {
          let page: any = getCurrentPages().pop();
          if (page === undefined || page == null) {
            return;
          }
        }
      });
    });
  }

  modifyPerson() {
    addressBooks({
      method: 'PUT',
      url: `addressBooks/${this.$mp.query.personId}`,
      data: {
        building_id: this.buildingId,
        name: this.name,
        mobile: this.mobile,
        kind: this.kind
      }
    }).then((res: any) => {
      wx.navigateBack({
        delta: 1,
        success: () => {
          let page: any = getCurrentPages().pop();
          if (page === undefined || page == null) {
            return;
          }
        }
      });
    });
  }
}
