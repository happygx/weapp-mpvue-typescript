/*
 * @Description:
 * @Author: happy
 * @Date: 2021-02-25 16:09:21
 * @LastEditTime: 2021-02-25 17:04:07
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import { buildings, getOssSign } from '@/api/common';
import Company from '@/components/Company/company.vue';
import Dialog from '../../../../static/vant/dialog/dialog';
import { uploadFile } from '@/utils/uploadOSS/uploadFile';

@Component({
  name: 'create',
  components: {
    Company
  }
})
export default class Create extends Vue {
  // data
  private OssSign: object = {};
  private buildingName: string = '';
  private classificationName: string = '';
  private form: any = {
    buildingId: '',
    kind: '',
    details: '',
    attachments: []
  };
  private validate: any = {
    buildingId: {
      name: '仓库名称'
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
  private classificationShow: boolean = false;
  private fileList: any[] = [];
  private textareaShow: boolean = true;

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
    this.getOssSignData();
  }

  getBuildings() {
    buildings().then((res: any) => {
      this.buildingName = res[0].name;
      this.form.buildingId = res[0].id;
      this.buildingsData = res;
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
        this.fileList.splice(index, 1);
        this.$tip('附件删除成功！');
      })
      .catch(() => {
        // on cancel
      });
  }

  submit(type: string) {
    for (let key of Object.keys(this.validate)) {
      if (this.form[key] === '') {
        this.$tip(`${this.validate[key].name}不能为空！`);
        return false;
      }
    }
    this.createQuestion();
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
    this.fileList = this.filterDifferent(this.fileList, this.form.attachments);
    this.form.attachments = [];
    for (let item of this.fileList) {
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
        objectName: objectName
      };
      this.form.attachments.push(obj);
    }
  }

  createQuestion() {
    //
  }

  createSuccess() {
    for (let file of this.fileList) {
      uploadFile(this.OssSign, {
        file: file,
        dir: 'iot',
        successCallback(res) {
          // console.log(res);
        }
      });
    }

    wx.redirectTo({
      url: '/pages/question/mine/main'
    });
  }
}
