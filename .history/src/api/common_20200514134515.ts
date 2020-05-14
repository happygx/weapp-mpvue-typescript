import Api from "@/utils/request";
console.log(Api.getOpenIdSessionKey);
export const getOpenIdSessionKey = (params = {}) => {
  return Api.getOpenIdSessionKey(params);
};

export const wxLogin = (params = {}) => {
  return Api.wxLogin(params);
};

export const wxLogout = (params = {}) => {
  return Api.wxLogout(params);
};
