import { Vue, Component } from 'vue-property-decorator';
import { wxDevicesSearch } from '@/api/question';
import { changePart, changeParts, wxChangePartUpdate } from '@/api/work';

@Component({
  name: 'device',
  components: {}
})
export default class Device extends Vue {
  // data
  private part: any = {};
  private maintainType: number = 0;
  private deviceType: number = 0;
  private deviceData: object[] = [];
  private deviceColumns: object[] = [];
  private deviceCode: number = 0;
  private deviceName: string = '';
  private content: string = '';
  private deviceShow: boolean = false;
  private standardData: object[] = [];
  private standardColumns: object[] = [];
  private standardShow: boolean = false;
  private remarksShow: boolean = false;
  private partStandardId: number = 0;
  private partStandardName: string = '';
  private partNumber: number = 1;

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
    if (this.$mp.query.part) {
      this.part = JSON.parse(this.$mp.query.part);
      this.fill();
    }
    this.getDevice();
    this.getPart();
  }

  fill() {
    this.deviceName = this.part.device_location;
    this.deviceType = this.part.type;
    this.deviceCode = this.part.device_code;
    this.partStandardName = this.part.part_standard;
    this.partStandardId = this.part.part_standard_id;
    this.partNumber = this.part.part_number;
  }

  getDevice() {
    wxDevicesSearch({
      data: {
        buildingId: this.$mp.query.buildingId
      }
    }).then((res: any) => {
      this.deviceData = res;
      this.deviceColumns = [
        {
          values: res.map((val: any) => {
            return {
              label: val.label,
              children: val.children
            };
          })
        },
        {
          values: res[0].children.map((val: any) => {
            let reg = /[A-Z|\-|\.|0-9].+/g;
            let floor = val.label.match(reg);
            return {
              label: floor,
              children: val.children
            };
          })
        },
        {
          values: res[0].children[0].children
        }
      ];
    });
  }

  getPart() {
    changePart().then((res: any) => {
      this.standardData = res;
      this.standardColumns = [
        {
          values: res.map((val: any) => {
            return {
              label: val.label,
              children: val.children
            };
          })
        },
        {
          values: res[0].children.map((val: any) => {
            return {
              label: val.label,
              children: val.children
            };
          })
        },
        {
          values: res[0].children[0].children
        }
      ];
    });
  }

  deviceChange(e: any) {
    const { picker, index, value } = e.target;
    if (index === 0) {
      picker.setColumnValues(1, value[index].children);
      picker.setColumnValues(2, value[index].children[0].children);
    } else if (index === 1) {
      picker.setColumnValues(2, value[index].children);
    }
  }

  deviceCancel() {
    this.deviceShow = false;
    // const picker = this.$mp.page.selectComponent('#devicePicker');
    // picker.setIndexes([0, 0, 0]); // 初始化索引
  }

  deviceConfirm(e: any) {
    let { type, label, code } = e.mp.detail.value[2];
    this.deviceType = type;
    this.deviceName = label;
    this.deviceCode = code;
    this.deviceCancel();
  }

  standardChange(e: any) {
    const { picker, index, value } = e.target;
    if (index === 0) {
      picker.setColumnValues(1, value[index].children);
      picker.setColumnValues(2, value[index].children[0].children);
    } else if (index === 1) {
      picker.setColumnValues(2, value[index].children);
    }
  }

  standardCancel() {
    this.standardShow = false;
    const picker = this.$mp.page.selectComponent('#standardPicker');
    picker.setIndexes([0, 0, 0]); // 初始化索引
  }

  standardConfirm(e: any) {
    let { value, label } = e.target.value[2];
    this.partStandardName = label;
    this.partStandardId = value;
    if (label === '其他部件') {
      this.remarksShow = true;
    }
    this.standardCancel();
  }

  stepChange(e: any) {
    this.partNumber = e.mp.detail;
  }

  cancel() {
    wx.navigateBack();
  }

  save() {
    if (this.deviceCode !== 0 && this.partStandardId !== 0) {
      let dataParam: any = {
        workflowId: this.$mp.query.workflowId,
        systemKeepRecordId: this.$mp.query.systemKeepRecordId,
        isRenewal: this.maintainType,
        deviceType: this.deviceType,
        deviceCode: this.deviceCode,
        partStandardId: this.partStandardId,
        content: this.content,
        partNumber: this.partNumber
      };
      if (this.part.id) {
        dataParam.changePartId = this.part.id;
        wxChangePartUpdate({
          method: 'PUT',
          data: dataParam
        }).then((res: any) => {
          this.cancel();
        });
      } else {
        changeParts({
          method: 'POST',
          data: dataParam
        }).then((res: any) => {
          this.cancel();
        });
      }
    } else {
      this.$tip('不能为空！');
    }
  }
}
