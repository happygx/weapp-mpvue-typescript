/*
 * @Description:
 * @Author: happy
 * @Date: 2021-02-25 16:10:06
 * @LastEditTime: 2021-02-25 16:11:18
 * @LastEditors: happy
 */
import { Vue, Component } from 'vue-property-decorator';
import {} from '@/api/common';

@Component({
  name: 'list',
  components: {}
})
export default class List extends Vue {
  // data
  ListName: string = 'list';

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
