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
  const cookie = Cookies.get(name);
  if (cookie) {
    return cookie;
  } else {
    return false;
  }
};
