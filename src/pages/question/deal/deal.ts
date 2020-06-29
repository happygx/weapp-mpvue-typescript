import { Vue, Component } from 'vue-property-decorator';
import {
  questions,
  questionClassifications,
  changeClassification,
  changeRank,
  wxDevicesSearch,
  deviceRelations,
  attachments,
  finishQuestion,
  approveQuestion,
} from '@/api/question';
import { buildings } from '@/api/common';
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { UserModule } from '@/store/module/user';
import Dialog from '../../../../static/vant/dialog/dialog';
import { isVideo } from '@/utils/common';

@Component({
  name: 'deal',
  components: {
    Popup,
  },
})
export default class Deal extends Vue {
  // data
  private roles: string = '';
  private isView: boolean = false;
  private questionsData: any = {};
  private classificationShow: boolean = false;
  private classificationsData: object[] = [];
  private rankShow: boolean = false;
  private rankList: object[] = [
    {
      id: 0,
      name: '一般',
    },
    {
      id: 1,
      name: '紧急',
    },
    {
      id: 2,
      name: '非常紧急',
    },
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
    if (this.$mp.query.view) {
      this.isView = true;
      wx.setNavigationBarTitle({
        title: '问题详情',
      });
    }
    this.roles = UserModule.info.group;
    this.getQuestionsData();
    this.getClassifications();
  }

  getQuestionsData() {
    questions({
      url: `questions/${this.$mp.query.id}`,
    }).then((res: any) => {
      // console.log(res);
      this.questionsData = res;
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

  getClassifications() {
    questionClassifications().then((res: object[]) => {
      this.classificationsData = res;
    });
  }

  popupShow(type: string) {
    this[type] = !this[type];
    setTimeout(() => {
      this.textareaShow = !this.textareaShow;
    }, 500);
  }

  recordConfirm(content: string) {
    buildings({
      method: 'PUT',
      url: `buildings/${this.questionsData.buildingId}`,
      data: {
        record: content,
      },
    }).then(() => {
      this.questionsData.building_record = content;
      this.recordShow = false;
      this.$tip('仓库记录修改成功！');
    });
  }

  classificationConfirm(e: any) {
    changeClassification({
      data: {
        questionId: this.questionsData.id,
        classificationId: e.target.value.id,
      },
    }).then((res: any) => {
      this.questionsData.classification_name = res.classification_name;
      this.classificationShow = false;
    });
  }

  rankConfirm(e: any) {
    changeRank({
      data: {
        questionId: this.questionsData.id,
        rank: e.target.value.id,
      },
    }).then((res: any) => {
      this.questionsData.rank = e.target.value.id;
      this.rankShow = false;
    });
  }

  deviceChange(e: any) {
    const { picker, value } = e.target;
    picker.setColumnValues(1, this.deviceData[value[0]]);
  }

  deviceCancel() {
    this.deviceShow = false;
    this.textareaShow = true;
    const picker = this.$mp.page.selectComponent('#devicePicker');
    picker.setIndexes([0, 0]); // 初始化索引
  }

  deviceConfirm(e: any) {
    let device = e.target.value[1];
    let isRepeat = this.devices.some((item: any) => {
      return item.code === device.code;
    });
    if (!isRepeat) {
      deviceRelations({
        method: 'POST',
        data: {
          questionId: this.questionsData.id,
          deviceCode: device.code,
          deviceType: device.type,
        },
      }).then((res: any) => {
        this.devices = res.device_relation;
        this.deviceCancel();
      });
    } else {
      this.$tip('此问题设备已存在！');
      this.deviceCancel();
    }
  }

  delDevice(index: number) {
    Dialog.confirm({
      message: '是否确定删除此设备？',
    })
      .then(() => {
        deviceRelations({
          method: 'DELETE',
          url: `deviceRelations/${this.devices[index].id}`,
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
          content: this.suggest,
        },
      }).then((result: any) => {
        wx.navigateTo({
          url: '/pages/question/upcoming/main',
        });
      });
    } else {
      this.$tip('处理意见不能为空！');
    }
  }

  handleFailure() {
    approveQuestion({
      method: 'POST',
      data: {
        questionId: this.questionsData.id,
        content: this.suggest,
      },
    }).then((result: any) => {
      wx.navigateTo({
        url: '/pages/question/upcoming/main',
      });
    });
  }

  imageError(i: number, j: number) {
    this.record[i].attachments[j].videoUrl = this.record[i].attachments[j].url;
    this.record[i].attachments[j].url = '/static/images/play.jpg';
    this.record[i].attachments[j].isVideo = true;
  }

  onPreview(record: any[], attachment: any) {
    if (attachment.isVideo) {
      this.video = attachment;
      this.videoShow = true;
    } else {
      wx.previewImage({
        urls: record.map((item) => item.url),
        current: attachment.url,
        fail(err) {
          // console.log(err);
          wx.showToast({ title: '预览图片失败', icon: 'none' });
        },
      });
    }
  }

  onVideoClose() {
    this.videoShow = false;
    this.video = {};
  }
}
