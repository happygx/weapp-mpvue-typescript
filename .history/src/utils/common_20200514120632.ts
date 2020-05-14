export const setStorage = (name: string, value: any) => {
  wx.setStorage({
    key: name,
    data: value,
  });
};
export const removeStorage = (name: string) => {
  wx.removeStorage({
    key: name,
  });
};
export const getStorage = (name: any) => {
  wx.getStorage({
    key: name,
    success: (res) => {
      return res;
    },
    fail: (err) => {
      return false;
    },
  });
};
