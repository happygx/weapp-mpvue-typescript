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

export const changePart = (params = {}) => {
  return Api.changePart(params);
};

export const changeParts = (params = {}) => {
  return Api.changeParts(params);
};

export const wxChangePartUpdate = (params = {}) => {
  return Api.wxChangePartUpdate(params);
};

export const addQuestion = (params = {}) => {
  return Api.addQuestion(params);
};

export const workflowSystemKeepRecords = (params = {}) => {
  return Api.workflowSystemKeepRecords(params);
};
