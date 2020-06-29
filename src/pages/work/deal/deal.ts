import { Vue, Component } from 'vue-property-decorator';
import { buildings } from '@/api/common';
import { workflows, changeParts, wxWorkflowUpdate } from '@/api/work';
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { UserModule } from '@/store/module/user';
import Dialog from '../../../../static/vant/dialog/dialog';

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
  private isConfirm: boolean = false;
  private workData: any = {};
  private recordShow: boolean = false;
  private part: object = {};
  private rankClass: string[] = [];

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
    this.roles = UserModule.info.group;
    if (this.roles === '养护员') {
      this.isView = true;
    } else {
      this.rankClass = ['', 'yellow', 'red'];
    }
    if (this.$mp.query.view === 'true') {
      this.isView = true;
    }
    this.getWorkData();
  }

  getWorkData() {
    workflows({
      url: `workflows/${this.$mp.query.id}`,
    }).then((res: any) => {
      // console.log(res);
      this.workData = res;
      if (UserModule.info.name === res.last_receive_user && res.status === 30) {
        this.isConfirm = true;
      }
    });
  }

  recordConfirm(content: string) {
    buildings({
      method: 'PUT',
      url: `buildings/${this.workData.building_id}`,
      data: {
        record: content,
      },
    }).then(() => {
      this.workData.building_record = content;
      this.recordShow = false;
      this.$tip('仓库记录修改成功！');
    });
  }

  addQuestion() {
    wx.navigateTo({
      url: `/pages/question/create/main?add=true&buildingId=${this.workData.building_id}&buildingName=${this.workData.building_name}&workflowId=${this.workData.id}`,
    });
  }

  dealQuestion(question: object, isView?: boolean) {
    // 当对象数据长度过大时会报错，因为url传参时程序把过长的那段数据给截取掉了，导致数据转换回来时格式不对而报错。
    // decodeURIComponent(options.obj),在encodeURIComponent之前要用JSON.stringify()先转换数据,decodeURIComponent之后再用JSON.parse()转换回来
    let view = isView ? isView : '';
    wx.navigateTo({
      url: `/pages/work/deal/question/main?question=${encodeURIComponent(
        JSON.stringify(question)
      )}&isView=${view}`,
    });
  }

  partModify(part?: object) {
    let Part = part ? JSON.stringify(part) : '';
    wx.navigateTo({
      url: `/pages/work/deal/device/main?buildingId=${this.workData.building_id}&workflowId=${this.workData.id}&systemKeepRecordId=${this.workData.system_keep_record_id}&part=${Part}`,
    });
  }

  partDelete(i: number) {
    Dialog.confirm({
      message: '是否确定删除此部件？',
    })
      .then(() => {
        changeParts({
          method: 'DELETE',
          url: `changeParts/${this.workData.change_part[i].id}`,
        }).then((res: any) => {
          this.workData.change_part.splice(i, 1);
          this.$tip('部件删除成功！');
        });
      })
      .catch(() => {
        // on cancel
      });
  }

  finish() {
    let QuestionsId: number[] = [];
    for (let item of this.workData.questions) {
      if (item.record.length === 0 || !item.record[0].revisable) {
        this.$tip(`${item.classification_name}问题处理结果为空！`);
        return false;
      } else {
        QuestionsId.push(item.id);
      }
    }
    this.submit(120, QuestionsId);
  }

  confirm() {
    let Operation = 180;
    if (this.roles === '售后经理') {
      Operation = 90;
    }
    let QuestionsId: number[] = [];
    for (let item of this.workData.questions) {
      QuestionsId.push(item.id);
    }
    this.submit(Operation, QuestionsId);
  }

  submit(operation: number, questionsId: number[]) {
    wxWorkflowUpdate({
      method: 'PUT',
      data: {
        operation: operation,
        questionsId: questionsId,
        workflowId: this.workData.id,
      },
    }).then((result: any) => {
      wx.navigateTo({
        url: '/pages/work/mine/main',
      });
    });
  }
}
