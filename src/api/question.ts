import Api from '@/utils/request';

export const questions = (params = {}) => {
  return Api.questions(params);
};

export const wxQuestionUpdate = (params = {}) => {
  return Api.wxQuestionUpdate(params);
};

export const questionConcerns = (params = {}) => {
  return Api.questionConcerns(params);
};

export const questionClassifications = (params = {}) => {
  return Api.questionClassifications(params);
};

export const workflowQuestionSolutions = (params = {}) => {
  return Api.workflowQuestionSolutions(params);
};

export const getUsers = (params = {}) => {
  return Api.getUsers(params);
};

export const wxDevicesSearch = (params = {}) => {
  return Api.wxDevicesSearch(params);
};

export const attachments = (params = {}) => {
  return Api.attachments(params);
};

export const deviceRelations = (params = {}) => {
  return Api.deviceRelations(params);
};

export const closeQuestion = (params = {}) => {
  return Api.closeQuestion(params);
};

export const concernDel = (params = {}) => {
  return Api.concernDel(params);
};

export const changeClassification = (params = {}) => {
  return Api.changeClassification(params);
};

export const changeRank = (params = {}) => {
  return Api.changeRank(params);
};

export const finishQuestion = (params = {}) => {
  return Api.finishQuestion(params);
};

export const approveQuestion = (params = {}) => {
  return Api.approveQuestion(params);
};

export const questionRecords = (params = {}) => {
  return Api.questionRecords(params);
};

export const wxQuestionRecordUpdate = (params = {}) => {
  return Api.wxQuestionRecordUpdate(params);
};
