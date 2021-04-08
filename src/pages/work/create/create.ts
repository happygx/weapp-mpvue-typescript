import { Vue, Component } from 'vue-property-decorator';
import { workflows, immigrationQuestion, removeQuestion } from '@/api/work';
import Company from '@/components/Company/company.vue';
import Question from '@/components/Question/question.vue';
import Popup from '@/components/Popup/popup.vue'; // mpvue目前只支持的单文件组件
import { buildings } from '@/api/common';
import { wxQuestionRecordUpdate, questionRecords, questions } from '@/api/question';
import Dialog from '../../../../static/vant/dialog/dialog';

@Component({
  name: 'create',
  components: {
    Company,
    Question,
    Popup
  }
})
export default class Create extends Vue {
  // data
  private province: string = '';
  private buildingName: string = '';
  private buildingId: any = 0;
  private provinces: string[] = [];
  private provinceShow: boolean = false;
  private buildingsData: object[] = [];
  private provinceBuildingsData: object[] = [];
  private companyShow: boolean = false;
  private operation: number = 14;
  private questionShow: boolean = false;
  private selectRows: any[] = [];
  private questions: object[] = [];
  private suggestShow: boolean = false;
  private suggestIndex: number | string = '';
  private suggestContent: string = '';
  private tableHeader: object[] = [
    { prop: 'exhibitor_name', icon: 'icon-user' },
    { prop: 'create_time', icon: 'icon-clock' },
    { prop: 'visibleName', icon: 'icon-status' }
  ];
  private tagType: string[] = ['default', 'warning', 'danger'];
  private workId: number = 0;
  private disabled: boolean = false;
  private componentShow: boolean = false;
  private isAll: boolean = false;

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
    // 修改工单
    if (this.$mp.query.id) {
      this.workId = this.$mp.query.id;
      this.disabled = true;
      this.getWorkflowData();
    }
    // 创建问题过来创建工单
    if (this.$mp.query.buildingId) {
      this.buildingId = this.$mp.query.buildingId;
      this.buildingName = this.$mp.query.buildingName;
      this.getQuestion();
    }
    // 待办问题创建工单
    if (this.$mp.query.questions) {
      this.selectRows = JSON.parse(decodeURIComponent(this.$mp.query.questions));
      this.buildingId = this.selectRows[0].building_id;
      this.buildingName = this.selectRows[0].building_name;
    }
  }

  getBuildings() {
    buildings().then((res: any) => {
      this.buildingsData = res;
      for (let item of res) {
        this.provinces.push(item.province);
      }
      this.provinces = [...new Set(this.provinces)];
    });
  }

  provinceConfirm(e: any) {
    this.provinceShow = false;
    this.province = e.target.value;
    this.getProvinceBuildings();
  }

  getProvinceBuildings() {
    buildings({
      data: {
        province: this.province
      }
    }).then((res: any) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].id === this.buildingId) {
          res.splice(i, 1);
          i--;
        } else {
          res[i].checked = false;
        }
      }
      this.buildingsData = res;
      this.provinceBuildingsData = res;
    });
  }

  getWorkflowData() {
    workflows({
      url: `workflows/${this.$mp.query.id}`
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

  getQuestion() {
    questions({
      data: {
        building_id: this.buildingId,
        status: 20,
        limit: 1
      }
    }).then((res: any) => {
      // console.log(res);
      this.selectRows = res.results;
    });
  }

  selectBuilding(b: { name: string; id: number; province: string }) {
    this.buildingName = b.name;
    this.buildingId = b.id;
    this.province = b.province;
    this.operation === 15 && this.getProvinceBuildings();
    // 清空上个仓库的信息
  }

  operationChange(e: any) {
    this.operation = e.mp.detail;
    if (this.operation === 15 && this.province !== '') {
      this.getProvinceBuildings();
    }
    if (this.operation === 15 || this.operation === 17) {
      this.selectRows = [];
    }
  }

  checkAll(e: any) {
    this.isAll = e.mp.detail;
    this.provinceBuildingsData.map((val: any) => {
      val.checked = e.mp.detail;
    });
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
          questionsId: JSON.stringify(questionsId)
        }
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
      message: '是否将此问题移出工单？'
    })
      .then(() => {
        if (this.workId) {
          removeQuestion({
            data: {
              questionId: this.selectRows[i].id,
              workflowId: this.workId
            }
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
    if (this.selectRows[i].record.length > 0 && this.selectRows[i].record[0].revisable) {
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
          revisable: true
        });
        this.suggestCancel();
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
      attachments: []
    };
    if (isModify) {
      wxQuestionRecordUpdate({
        method: 'PUT',
        data: dataParam
      }).then((res: any) => {
        this.suggestCancel();
      });
    } else {
      questionRecords({
        method: 'POST',
        data: dataParam
      }).then((res: any) => {
        for (let item of res) {
          item.visibleName = item.visible ? '可见' : '不可见';
        }
        this.selectRows = res;
        this.suggestCancel();
      });
    }
  }

  async onSubmit() {
    if (this.operation === 15) {
      let buildingList: number[] = [];
      this.buildingId && buildingList.push(this.buildingId);
      this.provinceBuildingsData.forEach((val: any) => {
        if (val.checked) {
          buildingList.push(val.id);
        }
      });
      this.buildingId = buildingList;
    }

    if (!this.buildingId || this.buildingId.length === 0) {
      this.$tip('请先选择仓库！');
      return false;
    }

    if (this.operation === 14 || this.operation === 16) {
      this.handleSubmitQuestion();
    } else if (this.operation === 15) {
      this.handleMaintenance();
    } else if (this.operation === 17) {
      this.submit();
    }
  }

  async submit() {
    workflows({
      method: 'POST',
      data: {
        operation: this.operation,
        buildingId: this.buildingId,
        questions: this.questions
      }
    }).then((result: any) => {
      wx.redirectTo({
        url: '/pages/work/mine/main'
      });
    });
  }

  handleSubmitQuestion() {
    if (this.selectRows.length > 0) {
      let visibleList: number[] = [];
      this.selectRows.forEach((item: any) => {
        visibleList.push(item.visible);
        let obj = {
          id: item.id,
          suggest: ''
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
    this.submit();
  }

  async handleMaintenance() {
    let res = await workflows({
      data: {
        building_id: this.buildingId.join(','),
        kind: 20,
        status: '10,20'
      }
    });
    if (res.count > 0) {
      Dialog.confirm({
        message: '此仓库下已有正在处理的维保单，是否继续创建？'
      })
        .then(() => {
          this.submit();
        })
        .catch(() => {
          //
        });
    } else {
      this.submit();
    }
  }
}
