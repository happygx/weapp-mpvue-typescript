import { Vue, Component } from 'vue-property-decorator';
import { workflows, immigrationQuestion, removeQuestion } from '@/api/work';
import Company from '@/components/Company/company.vue';
import Question from '@/components/Question/question.vue';
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { buildings } from '@/api/common';
import { wxQuestionRecordUpdate, questionRecords } from '@/api/question';
import Dialog from '../../../../static/vant/dialog/dialog';

@Component({
  name: 'create',
  components: {
    Company,
    Question,
    Popup,
  },
})
export default class Create extends Vue {
  // data
  private buildingName: string = '';
  private buildingId: number = NaN;
  private buildingsData: object[] = [];
  private companyShow: boolean = false;
  private operation: number = 14;
  private questionShow: boolean = false;
  private selectRows: any[] = [];
  private questions: object[] = [];
  private suggestShow: boolean = false;
  private suggestIndex: any = NaN;
  private suggestContent: string = '';
  private tableHeader: object[] = [
    { prop: 'exhibitor_name', icon: 'icon-user' },
    { prop: 'create_time', icon: 'icon-clock' },
    { prop: 'visibleName', icon: 'icon-status' },
  ];
  private tagType: string[] = ['default', 'warning', 'danger'];
  private workId: number = NaN;
  private disabled: boolean = false;

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
    if (this.$mp.query.id) {
      this.workId = this.$mp.query.id;
      this.disabled = true;
      this.getWorkflowData();
    }
  }

  getWorkflowData() {
    workflows({
      url: `workflows/${this.$mp.query.id}`,
    }).then((res: any) => {
      // console.log(res);
      for (let item of res.questions) {
        item.visibleName = item.visible ? '可见' : '不可见';
      }
      this.buildingName = res.building_abbreviation;
      this.buildingId = res.building_id;
      this.operation = res.operation;
      this.selectRows = res.questions;
    });
  }

  getBuildings() {
    buildings().then((res: any) => {
      this.buildingsData = res;
    });
  }

  selectBuilding(b: { name: string; id: number }) {
    this.buildingName = b.name;
    this.buildingId = b.id;
    // 清空上个仓库的信息
  }

  operationChange(e: any) {
    this.operation = e.mp.detail;
    if (this.operation === 15) {
      this.selectRows = [];
    }
  }

  selectQuestion() {
    if (this.buildingId) {
      this.questionShow = true;
    } else {
      this.$tip('请先选择仓库！');
    }
  }

  questionConfirm(selectRows: []) {
    if (this.$mp.query.id) {
      let questionsId: number[] = [];
      selectRows.forEach((item: any) => {
        questionsId.push(item.id);
      });
      immigrationQuestion({
        data: {
          workflowId: this.workId,
          questionsId: JSON.stringify(questionsId),
        },
      }).then((res: any) => {
        this.selectRows = [...this.selectRows, ...selectRows];
        this.questionShow = false;
      });
    } else {
      this.selectRows = selectRows;
      this.questionShow = false;
    }
  }

  expansion(row: any) {
    row.isExpansion = !row.isExpansion;
    this.$forceUpdate();
  }

  deleteQuestion(i: number) {
    Dialog.confirm({
      message: '是否将此问题移出工单？',
    })
      .then(() => {
        if (this.workId) {
          removeQuestion({
            data: {
              questionId: this.selectRows[i].id,
              workflowId: this.workId,
            },
          }).then((res: any) => {
            this.selectRows.splice(i, 1);
            this.$tip('问题移出成功！');
          });
        } else {
          this.selectRows.splice(i, 1);
        }
      })
      .catch(() => {
        // on cancel
      });
  }

  suggest(i: number) {
    this.suggestIndex = i;
    this.suggestShow = true;
    if (
      this.selectRows[i].record.length > 0 &&
      this.selectRows[i].record[0].revisable
    ) {
      this.suggestContent = this.selectRows[i].record[0].suggest;
    }
  }

  suggestCancel() {
    this.suggestShow = false;
    this.suggestContent = '';
  }

  suggestConfirm(content: string) {
    this.suggestContent = content;
    let question = this.selectRows[this.suggestIndex];
    if (question.record.length > 0 && question.record[0].revisable) {
      question.record[0].suggest = content;
      this.questionRecordChange(question, true);
    } else {
      if (this.workId) {
        this.questionRecordChange(question);
      } else {
        question.record.unshift({
          suggest: content,
          revisable: true,
        });
      }
    }
  }

  questionRecordChange(question: any, isModify?: boolean) {
    let dataParam = {
      recordId: isModify ? question.record[0].id : '',
      questionId: question.id,
      suggest: this.suggestContent,
      workflowId: this.workId,
      isFinish: question.record.length === 0 ? 10 : question.record[0].isFinish,
      attachments: [],
    };
    if (isModify) {
      wxQuestionRecordUpdate({
        method: 'PUT',
        data: dataParam,
      }).then((res: any) => {
        this.suggestShow = false;
      });
    } else {
      questionRecords({
        method: 'POST',
        data: dataParam,
      }).then((res: any) => {
        for (let item of res) {
          item.visibleName = item.visible ? '可见' : '不可见';
        }
        this.selectRows = res;
        this.suggestShow = false;
      });
    }
  }

  submit() {
    if (!this.buildingId) {
      this.$tip('请选择仓库名称！');
      return false;
    }
    if (this.operation !== 15) {
      if (this.selectRows.length > 0) {
        let visibleList: number[] = [];
        this.selectRows.forEach((item: any) => {
          visibleList.push(item.visible);
          let obj = {
            id: item.id,
            suggest: '',
          };
          if (item.record.length > 0 && item.record[0].revisable) {
            obj.suggest = item.record[0].suggest;
          }
          this.questions.push(obj);
        });
        if (this.operation === 14 && !visibleList.includes(1)) {
          this.$tip('维修单必须包含可见问题！');
          return false;
        }
      } else {
        this.$tip('请选择问题！');
        return false;
      }
    }
    workflows({
      method: 'POST',
      data: {
        operation: this.operation,
        buildingId: this.buildingId,
        questions: this.questions,
      },
    }).then((result: any) => {
      wx.navigateTo({
        url: '/pages/work/mine/main',
      });
    });
  }
}
