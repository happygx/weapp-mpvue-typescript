/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:53
 * @LastEditTime: 2020-12-14 16:15:03
 * @LastEditors: happy
 */
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
export const addressBooks = (params = {}) => {
  return Api.addressBooks(params);
};
export const locationUpdate = (params = {}) => {
  return Api.locationUpdate(params);
};
