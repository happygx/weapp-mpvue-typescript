import Api from "@/utils/request";

export const getOpenIdSessionKey = (params = {}) => {
  // console.log(Api.getOpenIdSessionKey(params));
  return Api.getOpenIdSessionKey(params);
};

export const wxLogin = (params = {}) => {
  return Api.wxLogin(params);
};

export const wxLogout = (params = {}) => {
  return Api.wxLogout(params);
};
