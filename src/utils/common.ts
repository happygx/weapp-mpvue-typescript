/**
 * @param  {string} key
 * @param  {any} value
 */
export const setStorage = (key: string, value: any) => {
  wx.setStorage({
    key: key,
    data: value,
  });
};

/**
 * @param  {string} key
 */
export const removeStorage = (key: string) => {
  wx.removeStorage({
    key: key,
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
      success: (res) => {
        return typeof success == 'function' && success(res.data);
      },
      fail: (err) => {
        return typeof success == 'function' && success(false);
      },
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
      url: `/pages/${name}/main`,
    });
  } else {
    wx.navigateTo({
      url: '/pages/login/main',
    });
  }
};
