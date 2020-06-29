import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { buildings, getOssSign } from '@/api/common';
import {
  questions,
  wxDevicesSearch,
  getUsers,
  attachments,
  wxQuestionUpdate,
  deviceRelations,
} from '@/api/question';
import Company from '@/components/Company/company.vue';
import { UserModule } from '@/store/module/user';
import { uploadFile } from '@/utils/uploadOSS/uploadFile';
import Dialog from '../../../../../static/vant/dialog/dialog';

@Component({
  name: 'add',
  components: {
    Company,
  },
})
export default class Add extends Vue {
  // prop
  @Prop({
    required: true,
  })
  classificationsData: object;
  @Prop({
    required: true,
  })
  classification: any;

  // data
  private questionId: string = '';
  private roles: string = '';
  private OssSign: object = {};
  private buildingName: string = '';
  private classificationName: string = '';
  private exhibitorName: string = '';
  private form: any = {
    buildingId: '',
    exhibitorId: '',
    classificationId: '',
    rank: 0,
    devices: [],
    content: '',
    attachments: [],
    faultsId: [],
    status: 10,
  };
  private validate: any = {
    buildingId: {
      name: '仓库名称',
    },
    exhibitorId: {
      name: '问题提出人',
    },
    classificationId: {
      name: '问题分类',
    },
    content: {
      name: '问题详情',
    },
  };
  private buildingsData: object[] = [];
  private companyShow: boolean = false;
  private exhibitorShow: boolean = false;
  private exhibitorData: object[] = [];
  private classificationShow: boolean = false;
  private deviceShow: boolean = false;
  private deviceData: object = {};
  private deviceColumns: object[] = [];
  private fileList: any[] = [];
  private disabled: boolean = false;
  private faultDevice: object[] = [];

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
    this.questionId = (this.$options.parent as any).$mp.query.id;
    if (this.questionId) {
      this.disabled = true;
      this.getQuestionsData();
    }
    this.roles = UserModule.info.group;
    if (this.roles === '养护员') {
      this.form.exhibitorId = UserModule.info.id;
      this.form.rank = 1;
    }
    if (JSON.stringify(this.classification) !== '{}') {
      this.classificationName = this.classification.name;
      this.form.classificationId = this.classification.id;
    }
    this.getBuildings();
    this.getOssSignData();
  }

  getQuestionsData() {
    questions({
      url: `questions/${this.questionId}`,
    }).then((res: any) => {
      // console.log(res);
      this.buildingName = res.building_name;
      this.form.buildingId = res.buildingId;
      this.getUsers(res.buildingId);
      this.getDevice(res.buildingId);
      this.exhibitorName = res.exhibitor_name;
      this.form.exhibitorId = res.exhibitorId;
      this.form.rank = res.rank;
      this.faultDevice = res.fault_device;
      this.form.devices = res.device_relation;
      this.classificationName = res.classification_name;
      this.form.classificationId = res.classificationId;
      this.form.status = res.status;
      this.form.content = res.content;
      this.form.attachments = [...res.attachments];
      this.fileList = res.attachments;
    });
  }

  getBuildings() {
    buildings().then((res: any) => {
      if (!this.questionId) {
        this.buildingName = res[0].name;
        this.form.buildingId = res[0].id;
        this.getUsers(res[0].id);
        this.getDevice(res[0].id);
      }
      this.buildingsData = res;
    });
  }

  getUsers(id: number) {
    getUsers({
      data: {
        buildingId: id,
      },
    }).then((res: any) => {
      this.exhibitorData = res;
    });
  }

  getDevice(id: number) {
    wxDevicesSearch({
      data: {
        buildingId: id,
      },
    }).then((res: any) => {
      this.deviceData = res;
      this.deviceColumns = [
        {
          values: Object.keys(res),
        },
        {
          values: res['空调'],
        },
      ];
    });
  }

  getOssSignData() {
    getOssSign().then((res: object) => {
      this.OssSign = res;
    });
  }

  selectBuilding(b: { name: string; id: number }) {
    this.buildingName = b.name;
    this.form.buildingId = b.id;
    // 清空上个仓库的信息
    this.exhibitorName = '';
    this.form.exhibitorId = '';
    this.form.devices = [];
    this.getDevice(b.id);
    this.getUsers(b.id);
  }

  exhibitorConfirm(e: any) {
    this.exhibitorName = e.target.value.username;
    this.form.exhibitorId = e.target.value.id;
    this.exhibitorShow = false;
  }

  classificationConfirm(e: any) {
    this.classificationName = e.target.value.name;
    this.form.classificationId = e.target.value.id;
    this.classificationShow = false;
  }

  deviceChange(e: any) {
    const { picker, value } = e.target;
    picker.setColumnValues(1, this.deviceData[value[0]]);
  }

  deviceCancel() {
    this.deviceShow = false;
    const picker = this.$parent.$mp.page.selectComponent('#devicePicker');
    picker.setIndexes([0, 0]); // 初始化索引
  }

  deviceConfirm(e: any) {
    let device = e.target.value[1];

    let isRepeat = this.form.devices.some((item: any) => {
      return item.code === device.code;
    });
    if (!isRepeat) {
      let type = 10;
      if (e.target.value[0] === '水泵') {
        type = 20;
      } else if (e.target.value[0] === '冷却塔') {
        type = 30;
      }
      device.type = type;
      this.form.devices.push(device);
    } else {
      this.$tip('此问题设备已存在！');
    }
    this.deviceCancel();
  }

  delDevice(index: number) {
    Dialog.confirm({
      message: '是否确定删除此设备？',
    })
      .then(() => {
        if (this.questionId && this.form.devices[index].id) {
          deviceRelations({
            method: 'DELETE',
            url: `deviceRelations/${this.form.devices[index].id}`,
          }).then((res: any) => {
            this.form.devices.splice(index, 1);
            this.$tip('设备删除成功！');
          });
        } else {
          this.form.devices.splice(index, 1);
          this.$tip('设备删除成功！');
        }
      })
      .catch(() => {
        // on cancel
      });
  }

  afterRead(e: any) {
    // console.log(e);
    e.mp.detail.file.uid = new Date().getTime(); // 返回数值单位是毫秒
    this.fileList.push(e.mp.detail.file);
  }

  handleRemove(e: any) {
    let index = e.mp.detail.index;
    Dialog.confirm({
      message: '是否确定删除此附件？',
    })
      .then(() => {
        if (this.questionId && this.fileList[index].id) {
          attachments({
            method: 'DELETE',
            url: `attachments/${this.fileList[index].id}`,
          }).then((res: any) => {
            // console.log(res);
            this.fileList.splice(index, 1);
            this.$tip('附件删除成功！');
          });
        } else {
          this.fileList.splice(index, 1);
          this.$tip('附件删除成功！');
        }
      })
      .catch(() => {
        // on cancel
      });
  }

  submit() {
    if (this.roles !== '养护员') {
      this.validate.exhibitorId = {
        name: '问题提出人',
      };
    }
    for (let key of Object.keys(this.validate)) {
      if (this.form[key] === '') {
        this.$tip(`${this.validate[key].name}不能为空！`);
        return false;
      }
    }
    this.createQuestion();
  }

  filterDifferent(arr1: any[], arr2: any[]) {
    return arr1.filter((item) => {
      return (
        arr2.findIndex((subItem) => {
          return subItem.url == item.url;
        }) === -1
      );
    });
  }

  getAttachments() {
    let attachments = this.filterDifferent(
      this.fileList,
      this.form.attachments
    );
    this.form.attachments = [];
    for (let item of attachments) {
      //获取最后一个.的位置
      let index = item.tempFilePath.lastIndexOf('.');
      //获取后缀
      let ext = item.tempFilePath.substr(index + 1);
      let name = `${item.uid}_wx.${ext}`;
      let objectName = item.tempFilePath.includes('tmp/')
        ? item.tempFilePath.split('tmp/')[1]
        : item.tempFilePath.split('tmp_')[1];
      let obj: object = {
        name: name,
        objectName: objectName,
      };
      this.form.attachments.push(obj);
    }
  }

  createQuestion() {
    this.getAttachments();
    if (this.questionId) {
      this.form.questionId = this.questionId;
      wxQuestionUpdate({
        method: 'PUT',
        data: this.form,
      }).then((res: any) => {
        this.createSuccess();
      });
    } else {
      questions({
        method: 'POST',
        data: this.form,
      }).then((res: any) => {
        this.createSuccess();
      });
    }
  }

  createSuccess() {
    for (let file of this.fileList) {
      uploadFile(this.OssSign, {
        file: file,
        dir: 'iot',
        successCallback(res) {
          // console.log(res);
        },
      });
    }
    wx.navigateBack();
  }
}
