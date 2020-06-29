import Api from '@/utils/request';

export const getOpenIdSessionKey = (params = {}) => {
  return Api.getOpenIdSessionKey(params);
};

export const wxLogin = (params = {}) => {
  return Api.wxLogin(params);
};

export const wxLogout = (params = {}) => {
  return Api.wxLogout(params);
};

export const buildings = (params = {}) => {
  return Api.buildings(params);
};

export const getOssSign = (params = {}) => {
  return Api.getOssSign(params);
};
