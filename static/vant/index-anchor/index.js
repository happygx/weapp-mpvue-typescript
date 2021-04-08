/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:53
 * @LastEditTime: 2020-12-17 14:14:58
 * @LastEditors: happy
 */
import { VantComponent } from '../common/component';
VantComponent({
  relation: {
    name: 'index-bar',
    type: 'ancestor',
    current: 'index-anchor'
  },
  props: {
    useSlot: Boolean,
    index: null
  },
  data: {
    active: false,
    wrapperStyle: '',
    anchorStyle: ''
  },
  methods: {
    scrollIntoView(scrollTop) {
      this.getBoundingClientRect().then(rect => {
        let marginTop = 50;
        wx.pageScrollTo({
          scrollTop: scrollTop + rect.top - this.parent.data.stickyOffsetTop - marginTop
        });
      });
    },
    getBoundingClientRect() {
      return this.getRect('.van-index-anchor-wrapper');
    }
  }
});
