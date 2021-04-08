import { Vue, Component } from 'vue-property-decorator';
import {
  questions,
  questionClassifications,
  changeClassification,
  changeRank,
  wxDevicesSearch,
  deviceRelations,
  finishQuestion,
  approveQuestion
} from '@/api/question';
import { buildings } from '@/api/common';
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { UserModule } from '@/store/module/user';
import Dialog from '../../../../static/vant/dialog/dialog';
import { isVideo } from '@/utils/common';

@Component({
  name: 'deal',
  components: {
    Popup
  }
})
export default class Deal extends Vue {
  // data
  private roles: string = '';
  private isView: boolean = false;
  private questionsData: any = {};
  private buildingRecord: string = '';
  private classificationShow: boolean = false;
  private classificationsData: object[] = [];
  private rankShow: boolean = false;
  private rankList: object[] = [
    {
      id: 0,
      name: '一般'
    },
    {
      id: 1,
      name: '紧急'
    },
    {
      id: 2,
      name: '非常紧急'
    }
  ];
  private recordShow: boolean = false;
  private deviceShow: boolean = false;
  private textareaShow: boolean = true;
  private deviceData: object = {};
  private deviceColumns: object[] = [];
  private devices: any[] = [];
  private faultDevices: object[] = [];
  private attachments: any[] = [];
  private record: any[] = [];
  private suggest: string = '';
  private videoShow: boolean = false;
  private video: object = {};
  private componentShow: boolean = false;

  // 监听页面加载
  onLoad() {
    //
  }

  // 小程序 hook
  onShow() {
    this.init();
  }

  // vue hook
  mounted() {
    //
  }

  // 初始化函数
  init() {
    if (this.$mp.query.view === 'true') {
      this.isView = true;
      wx.setNavigationBarTitle({
        title: '问题详情'
      });
    }
    this.roles = UserModule.info.group;
    this.getQuestionsData();
    this.getClassifications();
  }

  getQuestionsData() {
    questions({
      url: `questions/${this.$mp.query.id}`
    }).then((res: any) => {
      // console.log(res);
      this.questionsData = res;
      this.buildingRecord = res.building_record;
      this.devices = res.device_relation;
      this.faultDevices = res.fault_device;
      this.attachments = res.attachments;
      for (let item of this.attachments) {
        if (isVideo(item.url)) {
          item.errUrl = '/static/images/play.jpg';
        }
      }
      this.record = res.record;
      this.getDevice(res.buildingId);
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

  getClassifications() {
    questionClassifications().then((res: object[]) => {
      this.classificationsData = res;
    });
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

  recordConfirm(content: string) {
    buildings({
      method: 'PUT',
      url: `buildings/wxBuildingRecordUpdate`,
      data: {
        buildingId: this.questionsData.buildingId,
        record: content
      }
    }).then(() => {
      this.buildingRecord = content;
      this.recordShow = false;
      this.$tip('注意事项修改成功！');
    });
  }

  classificationConfirm(e: any) {
    changeClassification({
      data: {
        questionId: this.questionsData.id,
        classificationId: e.target.value.id
      }
    }).then((res: any) => {
      this.questionsData.classification_name = res.classification_name;
      this.popupShow('classificationShow');
    });
  }

  rankConfirm(e: any) {
    changeRank({
      data: {
        questionId: this.questionsData.id,
        rank: e.target.value.id
      }
    }).then((res: any) => {
      this.questionsData.rank = e.target.value.id;
      this.popupShow('rankShow');
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
    setTimeout(() => {
      this.textareaShow = true;
      // const picker = this.$mp.page.selectComponent('#devicePicker');
      // picker.setIndexes([0, 0, 0]); // 初始化索引
    }, 300);
  }

  deviceConfirm(e: any) {
    let { value } = e.mp.detail;
    let isRepeat = this.devices.some((item: any) => {
      return item.code === value[2].code;
    });
    if (!isRepeat) {
      deviceRelations({
        method: 'POST',
        data: {
          questionId: this.questionsData.id,
          deviceCode: value[2].code,
          deviceType: value[2].type
        }
      }).then((res: any) => {
        this.devices = res.device_relation;
        this.deviceCancel();
      });
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
        deviceRelations({
          method: 'DELETE',
          url: `deviceRelations/${this.devices[index].id}`
        }).then((res: any) => {
          this.devices.splice(index, 1);
          this.$tip('设备删除成功！');
        });
      })
      .catch(() => {
        // on cancel
      });
  }

  handleSuccess() {
    if (this.suggest !== '') {
      finishQuestion({
        method: 'POST',
        data: {
          questionId: this.questionsData.id,
          content: this.suggest
        }
      }).then((result: any) => {
        this.cancel();
      });
    } else {
      this.$tip('处理意见不能为空！');
    }
  }

  handleFailure() {
    Dialog.confirm({
      message: '是否确定流转？'
    })
      .then(() => {
        approveQuestion({
          method: 'POST',
          data: {
            questionId: this.questionsData.id,
            content: this.suggest
          }
        }).then((result: any) => {
          this.cancel();
        });
      })
      .catch(() => {
        // on cancel
      });
  }

  cancel() {
    wx.navigateBack({
      delta: 1,
      success: () => {
        let page: any = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onPullDownRefresh();
      }
    });
  }

  onPreview(row: any) {
    const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
    const VIDEO_REGEXP = /\.(mp4|mov|m4v|3gp|avi|m3u8|webm)/i;
    const DOC_REGEXP = /\.(txt|xls|xlsx|doc|docx|pdf|ppt|)/i;
    if (IMAGE_REGEXP.test(row.url)) {
      wx.previewImage({
        urls: [row.url],
        current: row.url,
        fail(err) {
          wx.showToast({ title: '预览图片失败', icon: 'none' });
        }
      });
    } else if (VIDEO_REGEXP.test(row.url)) {
      this.video = row;
      this.videoShow = true;
    } else if (DOC_REGEXP.test(row.url)) {
      this.downloadFile(row);
    } else {
      wx.showToast({ title: '文件不支持预览！', icon: 'none' });
    }
  }

  downloadFile(row: any) {
    let filePath = row.url;
    let filename = row.name;
    let index = filename.lastIndexOf('.');
    let fileType = filename.substr(index + 1);
    // 下载对应文件
    wx.downloadFile({
      url: filePath,
      success(res) {
        let filePath = res.tempFilePath; // 文件路径
        wx.openDocument({
          filePath, // 装载对应文件的路径
          fileType, // 指定打开的文件类型
          success(res) {
            console.log('打开成功');
          },
          fail(res) {
            console.log(res);
          }
        });
      },
      fail(res) {
        console.log(res);
      }
    });
  }

  work() {
    wx.navigateTo({
      url: `/pages/work/deal/main?id=${this.questionsData.workflow_id}&view=true`
    });
  }
}
