import { Vue, Component } from 'vue-property-decorator';
import {} from '@/api/common';

@Component({
  name: 'survey',
  components: {

  }
})
export default class Survey extends Vue {
  // data
  SurveyName: string = 'survey'

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
    //
  }

}
