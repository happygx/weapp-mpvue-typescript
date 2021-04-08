import { Vue, Component } from 'vue-property-decorator';
import {
  wxDevicesSearch,
  deviceRelations,
  questionRecords,
  attachments,
  wxQuestionRecordUpdate
} from '@/api/question';
import Dialog from '../../../../../static/vant/dialog/dialog';
import { isVideo } from '@/utils/common';
import { uploadFile } from '@/utils/uploadOSS/uploadFile';
import { getOssSign } from '@/api/common';

@Component({
  name: 'question',
  components: {}
})
export default class Question extends Vue {
  // data
  private isView: boolean = false;
  private questionsData: any = {};
  private rankList: string[] = ['一般', '紧急', '非常紧急'];
  private faultDevices: object[] = [];
  private devices: any[] = [];
  private deviceData: object = {};
  private deviceColumns: object[] = [];
  private deviceShow: boolean = false;
  private attachments: any[] = [];
  private recordAttachments: any[] = [];
  private record: any[] = [];
  private videoShow: boolean = false;
  private textareaShow: boolean = true;
  private video: object = {};
  private isFinish: number = 20;
  private suggest: string = '';
  private fileList: any[] = [];
  private OssSign: object = {};

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
    this.isView = this.$mp.query.isView ? true : false;
    this.getQuestionsData();
    if (!this.isView) {
      this.getOssSignData();
    }
  }

  getQuestionsData() {
    this.questionsData = JSON.parse(decodeURIComponent(this.$mp.query.question));
    this.faultDevices = this.questionsData.fault_device;
    this.devices = this.questionsData.device_relation;
    this.attachments = this.questionsData.attachments;
    for (let item of this.attachments) {
      if (isVideo(item.url)) {
        item.errUrl = '/static/images/play.jpg';
      }
    }

    if (!this.isView) {
      this.getDevice(this.questionsData.buildingId);
    }
    this.record = this.questionsData.record;
    if (this.record.length > 0 && this.record[0].revisable) {
      this.isFinish = this.record[0].isFinish;
      this.suggest = this.record[0].suggest;
      this.recordAttachments = [...this.questionsData.record[0].attachments];
      this.fileList = [...this.questionsData.record[0].attachments];
    }
  }

  getOssSignData() {
    getOssSign().then((res: object) => {
      this.OssSign = res;
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

  addDevice() {
    this.deviceShow = true;
    this.textareaShow = false;
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
    }, 300);
    // const picker = this.$mp.page.selectComponent('#devicePicker');
    // picker.setIndexes([0, 0, 0]); // 初始化索引
  }

  deviceConfirm(e: any) {
    let device = e.mp.detail.value[2];
    let isRepeat = this.devices.some((item: any) => {
      return item.code === device.code;
    });
    if (!isRepeat) {
      deviceRelations({
        method: 'POST',
        data: {
          questionId: this.questionsData.id,
          deviceCode: device.code,
          deviceType: device.type
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
        if (this.fileList[index].id) {
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

  filterDifferent(arr1: any[], arr2: any[]) {
    return arr1.filter(item => {
      return (
        arr2.findIndex(subItem => {
          return subItem.url == item.url;
        }) === -1
      );
    });
  }

  getAttachments() {
    this.fileList = this.filterDifferent(this.fileList, this.recordAttachments);
    this.recordAttachments = [];
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
      this.recordAttachments.push(obj);
    }
  }

  save() {
    this.getAttachments();
    if (this.suggest === '') {
      this.$tip('处理结果不能为空！');
    } else {
      let dataParam: any = {
        questionId: this.questionsData.id,
        suggest: this.suggest,
        workflowId: this.questionsData.workflow_id,
        isFinish: this.isFinish,
        attachments: this.recordAttachments
      };
      if (this.questionsData.record.length > 0 && this.questionsData.record[0].revisable) {
        dataParam.recordId = this.questionsData.record[0].id;
        wxQuestionRecordUpdate({
          method: 'PUT',
          data: dataParam
        }).then((res: any) => {
          this.createSuccess();
        });
      } else {
        questionRecords({
          method: 'POST',
          data: dataParam
        }).then((res: any) => {
          this.createSuccess();
        });
      }
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
    wx.navigateBack();
  }
}
