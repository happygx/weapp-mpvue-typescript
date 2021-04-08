/*
 * @Description:
 * @Author: happygx
 * @Date: 2020-11-20 11:00:43
 * @LastEditTime: 2020-12-16 09:53:49
 * @LastEditors: happy
 */
import { concernDel, questionConcerns } from '@/api/question';

export default {
  install(_Vue: any) {
    // 添加全局方法或属性
    _Vue.prototype.$isPage = function isPage() {
      if (this.$mp) {
        return this.$mp && this.$mp.mpType === 'page';
      } else {
        return false;
      }
    };

    // 注入组件
    _Vue.mixin({
      methods: {
        attention(row: any) {
          questionConcerns({
            method: 'POST',
            data: {
              questionId: row.id
            }
          }).then((res: any) => {
            row.operates[0].name = '取消关注';
            row.concern = true;
            _Vue.prototype.$tip('关注成功！');
          });
        },
        cancelAttention(row: any) {
          concernDel({
            data: {
              questionId: row.id
            }
          }).then((res: any) => {
            row.operates[0].name = '关注';
            row.concern = false;
            _Vue.prototype.$tip('取消成功！');
          });
        }
      },
      // 页面加载
      onLoad() {
        if (this.$isPage() && !this.componentShow) {
          // 新进入页面
          this.componentShow = true;
        }
      },
      // 页面卸载
      onUnload() {
        if (this.$isPage() && this.componentShow) {
          Object.assign(this.$data, this.$options.data()); // 数据初始化
          this.componentShow = false; // 销毁组件
        }
      },
      // 下拉刷新
      onPullDownRefresh() {
        if (this.$isPage() && !this.isRefresh) {
          Object.assign(this.$data, this.$options.data()); // 数据初始化
          this.componentShow = true;
          this.isRefresh = true;
          this.init();
        }
      },
      // 上拉加载
      onReachBottom() {
        if (this.$isPage() && this.tableConfig && this.tableConfig.isMore && this.isMoreLoading) {
          this.isMoreLoading = false;
          this.getData(
            {
              offset: ++this.curPage * 10
            },
            true
          );
        }
      }
    });
  }
};
