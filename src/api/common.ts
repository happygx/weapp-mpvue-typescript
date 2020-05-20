import Api from '@/utils/request';

export const getOpenIdSessionKey = (params = {}) => {
  return Api.getOpenIdSessionKey(params);
};

export const userInformationData = (params = {}) => {
  return Api.userInformationData(params);
};

export const userSensitiveData = (params = {}) => {
  return Api.userSensitiveData(params);
};

export const wxLogin = (params = {}) => {
  return Api.wxLogin(params);
};

export const wxLogout = (params = {}) => {
  return Api.wxLogout(params);
};
