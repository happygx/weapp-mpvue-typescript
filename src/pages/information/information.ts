import { getStorage } from '@/utils/common';
import { Vue, Component } from 'vue-property-decorator';
import {} from '@/api/common';
import {} from '@/components'; // 组件

@Component({
  name: 'information',
  components: {},
})
export default class Information extends Vue {
  // data
  private info: object = {};

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
    this.info = getStorage('info', true);
  }
}
