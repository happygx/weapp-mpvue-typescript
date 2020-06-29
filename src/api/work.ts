import Api from '@/utils/request';

export const workflows = (params = {}) => {
  return Api.workflows(params);
};

export const wxWorkflowUpdate = (params = {}) => {
  return Api.wxWorkflowUpdate(params);
};

export const getAfterSalePerson = (params = {}) => {
  return Api.getAfterSalePerson(params);
};

export const immigrationQuestion = (params = {}) => {
  return Api.immigrationQuestion(params);
};

export const removeQuestion = (params = {}) => {
  return Api.removeQuestion(params);
};
