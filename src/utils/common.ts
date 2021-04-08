/*
 * @Description:
 * @Author: happygx
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-02-25 09:21:46
 * @LastEditors: happy
 */

/**
 * @param  {string} key
 * @param  {any} value
 */
export const setStorage = (key: string, value: any) => {
  wx.setStorage({
    key: key,
    data: value
  });
};

/**
 * @param  {string} key
 */
export const removeStorage = (key: string) => {
  wx.removeStorage({
    key: key
  });
};

/**
 * @param  {string} key
 * @param  {boolean} sync
 * @param  {any} success?
 */
export const getStorage = (key: string, sync: boolean, success?: any): any => {
  if (sync) {
    return wx.getStorageSync(key);
  } else {
    wx.getStorage({
      key: key,
      success: res => {
        return typeof success === 'function' && success(res.data);
      },
      fail: () => {
        return typeof success === 'function' && success(false);
      }
    });
  }
};

/**
 * @param  {string} path
 */
export const routeInterception = (name: string) => {
  var info = wx.getStorageSync('info');
  if (info) {
    wx.navigateTo({
      url: `/pages/mine/${name}/main`
    });
  } else {
    wx.navigateTo({
      url: '/pages/login/main'
    });
  }
};

/**
 * @msg: 获取系统当前时间
 * @param {string} date 时间
 * @param {string} fmt 时间格式
 * @return: string
 */
export const formatDate = (date: any, fmt: string) => {
  let time = fmt;
  const o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
  };
  if (/(y+)/.test(fmt)) {
    time = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      time = time.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return time;
};

/**
 * @msg  获取上个月的当前时间及当前时间
 * @param  {boolean} pre
 * @return  Object
 */
export const getLastMonth = (pre: boolean = true) => {
  let now = new Date();
  let year = now.getFullYear(); // getYear()+1900=getFullYear()
  let month: any = now.getMonth() + 1; // 0-11表示1-12月
  let day: any = now.getDate();
  let day2: any = new Date(now.getTime() - 24 * 60 * 60 * 1000).getDate();
  let dateObj: any = {};
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  day2 = day2 < 10 ? '0' + day2 : day2;

  if (pre) {
    dateObj.now = year + '-' + month + '-' + day2;
  } else {
    dateObj.now = year + '-' + month + '-' + day;
  }

  if (Number(month) === 1) {
    // 如果是1月份，则取上一年的12月份
    dateObj.last = year - 1 + '-12-' + day;
    return dateObj;
  }

  let preSize = new Date(year, month - 1, 0).getDate(); // 上月总天数
  if (preSize < day) {
    // 上月总天数<本月日期，比如3月的30日，在2月中没有30
    dateObj.last = year + '-' + month + '-01';
    return dateObj;
  }

  if (Number(month) <= 10) {
    dateObj.last = year + '-0' + (month - 1) + '-' + day;
    return dateObj;
  } else {
    dateObj.last = year + '-' + (month - 1) + '-' + day;
    return dateObj;
  }
};
/**
 * @param  {string} msg
 */
export const tip = (msg: string) => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 1000
  });
};

/**
 * @description:
 * @param {object} target
 * @param {object} source
 * @return {*}
 */
// export const objectAssign = (target: object, source: object): any => {
//   for (let key in source) {
//     // console.log(key);
//     // 遍历参数的键
//     if (typeof source[key] === 'object') {
//       let isEmpty = Array.isArray(source[key])
//         ? source[key].length === 0
//         : Object.keys(source[key]).length === 0;
//       if (isEmpty) {
//         target[key] = source[key]; // 值为空直接复制值
//       } else {
//         objectAssign(target[key], source[key]); // 值是对象就再次调用函数
//       }
//     } else {
//       target[key] = source[key]; // 基本类型直接复制值
//     }
//   }
// };

/**
 * @description:
 * @param {string} url
 * @return {*}
 */
export const isVideo = (url: string): any => {
  const VIDEO_REGEXP = /\.(mp4|mov|m4v|3gp|avi|m3u8|webm)/i;
  return VIDEO_REGEXP.test(url);
};

/**
 * @description:
 * @param {any} fn
 * @param {number} delay
 * @return {*}
 */
export const debounce = (fn: any, delay: number = 1000): any => {
  let timer: any = null; // 借助闭包
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay); // 简化写法
  };
};

/**
 * @description:
 * @param {boolean} isRefresh
 * @return {*}
 */
export const refreshInit = (isRefresh: boolean): boolean => {
  if (isRefresh) {
    wx.stopPullDownRefresh({
      success: () => {
        //
      }
    });
  }
  return false;
};

/**
 * @description:
 * @param {any} row
 * @return {*}
 */
export const workStatusType = (row: any): string => {
  switch (row.status) {
    case 10:
      return '新建';
    case 20:
      return '处理中';
    case 30:
      return '已处理';
    default:
      return '已完结';
  }
};

/**
 * @description:
 * @param {any} row
 * @return {*}
 */
export const questionStatusType = (row: any): string => {
  switch (row.status) {
    case 10:
      return '预处理';
    case 20:
      return '待处理';
    case 30:
      return '处理中';
    case 40:
      return '已处理';
    default:
      return '已关闭';
  }
};
