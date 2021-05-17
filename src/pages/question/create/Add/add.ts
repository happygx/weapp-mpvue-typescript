import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { buildings, getOssSign } from '@/api/common';
import {
  questions,
  wxDevicesSearch,
  getUsers,
  attachments,
  wxQuestionUpdate,
  deviceRelations
} from '@/api/question';
import Company from '@/components/Company/company.vue';
import { UserModule } from '@/store/module/login';
import { uploadFile } from '@/utils/uploadOSS/uploadFile';
import Dialog from '../../../../../static/vant/dialog/dialog';
import { addQuestion } from '@/api/work';

@Component({
  name: 'add',
  components: {
    Company
  }
})
export default class Add extends Vue {
  // prop
  @Prop({
    required: true
  })
  classificationsData: object;
  @Prop({
    required: true
  })
  classification: any;

  // data
  private workflowId: string = '';
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
    status: 10
  };
  private validate: any = {
    buildingId: {
      name: '仓库名称'
    },
    exhibitorId: {
      name: '问题提出人'
    },
    classificationId: {
      name: '问题分类'
    },
    content: {
      name: '问题详情'
    }
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
  private textareaShow: boolean = true;
  private createWork: boolean = false;
  private isSubmit: boolean = false;

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
    this.questionId = (this.$options as any).parent.$mp.query.id;
    if (this.questionId) {
      this.disabled = true;
      this.getQuestionsData();
    }
    this.roles = UserModule.info.group;
    if (this.roles === '售后经理' || this.roles === '售后人员') {
      this.form.status = 20;
    }

    this.exhibitorName = UserModule.info.name;
    this.form.exhibitorId = UserModule.info.id;
    if (this.roles === '养护员') {
      this.form.exhibitorId = UserModule.info.id;
      this.form.rank = 1;
    }
    if (JSON.stringify(this.classification) !== '{}') {
      this.classificationName = this.classification.name;
      this.form.classificationId = this.classification.id;
    }
    this.workflowId = (this.$options as any).parent.$mp.query.workflowId;
    if (this.workflowId) {
      this.disabled = true;
      this.buildingName = (this.$options as any).parent.$mp.query.buildingName;
      this.form.buildingId = (this.$options as any).parent.$mp.query.buildingId;
      this.getUsers(this.form.buildingId);
      this.getDevice(this.form.buildingId);
    } else {
      this.getBuildings();
    }
    this.getOssSignData();
  }

  get getWidth() {
    let result =
      this.roles !== '售后经理' || (this.form.status === 10 && !this.workflowId) || this.workflowId
        ? 'w100'
        : '';
    return result;
  }

  getQuestionsData() {
    questions({
      url: `questions/${this.questionId}`
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
      this.fileList = [...res.attachments];
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
        buildingId: id
      }
    }).then((res: any) => {
      this.exhibitorData = res;
    });
  }

  getDevice(id: number) {
    wxDevicesSearch({
      data: {
        buildingId: id
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
              label: floor ? floor : val.label,
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
    this.exhibitorName = UserModule.info.name;
    this.form.exhibitorId = '';
    this.form.exhibitorId = UserModule.info.id;
    this.form.devices = [];
    this.getDevice(b.id);
    this.getUsers(b.id);
  }

  popupShow(type: string) {
    this[type] = !this[type];
    if (this.textareaShow === false) {
      setTimeout(() => {
        this.textareaShow = true;
      }, 300);
    } else {
      this.textareaShow = false;
    }
  }

  exhibitorConfirm(e: any) {
    this.exhibitorName = e.target.value.username;
    this.form.exhibitorId = e.target.value.id;
    this.popupShow('exhibitorShow');
  }

  classificationConfirm(e: any) {
    this.classificationName = e.target.value.name;
    this.form.classificationId = e.target.value.id;
    this.popupShow('classificationShow');
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
    setTimeout(() => {
      this.textareaShow = true;
      // const picker = this.$parent.$mp.page.selectComponent('#devicePicker');
      // picker.setIndexes([0, 0, 0]); // 初始化索引
    }, 300);
  }

  deviceConfirm(e: any) {
    let { value } = e.mp.detail;
    let isRepeat = this.form.devices.some((item: any) => {
      return item.code === value[2].code;
    });
    if (!isRepeat) {
      value[2].location = value[2].label;
      this.form.devices.push(value[2]);
    } else {
      this.$tip('此问题设备已存在！');
    }
    this.deviceCancel();
  }

  delDevice(index: number) {
    Dialog.confirm({
      message: '是否确定删除此设备？'
    })
      .then(() => {
        if (this.questionId && this.form.devices[index].id) {
          deviceRelations({
            method: 'DELETE',
            url: `deviceRelations/${this.form.devices[index].id}`
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
      message: '是否确定删除此附件？'
    })
      .then(() => {
        if (this.questionId && this.fileList[index].id) {
          attachments({
            method: 'DELETE',
            url: `attachments/${this.fileList[index].id}`
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

  submit(type: string) {
    if (this.roles !== '养护员') {
      this.validate.exhibitorId = {
        name: '问题提出人'
      };
    }
    for (let key of Object.keys(this.validate)) {
      if (this.form[key] === '') {
        this.$tip(`${this.validate[key].name}不能为空！`);
        return false;
      }
    }
    if (type === 'work') {
      this.createWork = true;
    }
    // 防止网络不好时连续点击
    if (!this.isSubmit) {
      this.isSubmit = true;
      this.createQuestion();
    } else {
      this.$tip('请稍等！');
    }
  }

  filterDifferent(arr1: any[], arr2: any[]) {
    return arr1.filter(item => {
      return (
        arr2.findIndex(subItem => {
          return subItem.url === item.url;
        }) === -1
      );
    });
  }

  getAttachments() {
    this.fileList = this.filterDifferent(this.fileList, this.form.attachments);
    this.form.attachments = [];
    for (let item of this.fileList) {
      // 获取最后一个.的位置
      let index = item.tempFilePath.lastIndexOf('.');
      // 获取后缀
      let ext = item.tempFilePath.substr(index + 1);
      let name = `${item.uid}_wx.${ext}`;
      let objectName = item.tempFilePath.includes('tmp/')
        ? item.tempFilePath.split('tmp/')[1]
        : item.tempFilePath.split('tmp_')[1];
      let obj: object = {
        name,
        objectName
      };
      this.form.attachments.push(obj);
    }
  }

  createQuestion() {
    this.getAttachments();
    if (this.workflowId) {
      this.add();
    } else {
      this.create();
    }
  }

  add() {
    this.form.workflowId = this.workflowId;
    addQuestion({
      method: 'POST',
      data: this.form
    }).then((res: any) => {
      this.createSuccess();
    });
  }

  create() {
    if (this.questionId) {
      this.form.questionId = this.questionId;
      wxQuestionUpdate({
        method: 'PUT',
        data: this.form
      }).then((res: any) => {
        this.createSuccess();
      });
    } else {
      questions({
        method: 'POST',
        data: this.form
      }).then((res: any) => {
        this.createSuccess();
      });
    }
  }

  createSuccess() {
    for (let file of this.fileList) {
      uploadFile(this.OssSign, {
        file,
        dir: 'iot',
        successCallback(res) {
          // console.log(res);
        }
      });
    }
    if (this.createWork) {
      wx.redirectTo({
        url: `/pages/work/create/main?buildingId=${this.form.buildingId}&buildingName=${this.buildingName}`
      });
    } else {
      if (this.disabled) {
        wx.navigateBack({
          delta: 1,
          success: () => {
            let page: any = getCurrentPages().pop();
            if (page === undefined || page === null) {
              return;
            }
            page.onPullDownRefresh();
          }
        });
      } else {
        wx.redirectTo({
          url: '/pages/question/mine/main'
        });
      }
    }
  }
}
