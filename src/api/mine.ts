import Api from '@/utils/request';

export const userInformationData = (params = {}) => {
  return Api.userInformationData(params);
};

export const sendVerificationCode = (params = {}) => {
  return Api.sendVerificationCode(params);
};

export const compareVerificationCode = (params = {}) => {
  return Api.compareVerificationCode(params);
};

export const userInformationUpdate = (params = {}) => {
  return Api.userInformationUpdate(params);
};
