/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:53
 * @LastEditTime: 2021-03-10 14:43:39
 * @LastEditors: happy
 */
export default {
  getOpenIdSessionKey: 'getOpenidSessionKey', // 获取3rd_session
  wxLogin: 'wxlogin', // 登录
  wxLogout: 'wxlogout', // 退出
  userInformationData: 'users/userInformationData', // 获取个人信息
  sendVerificationCode: 'users/sendVerificationCode', // 获取验证码
  compareVerificationCode: 'users/compareVerificationCode', // 对比验证码
  userInformationUpdate: 'users/userInformationUpdate', // 保存个人信息
  userCompanyView: 'buildings/userCompanyView', // 获取公司
  alarms: 'alarms', // 获取告警数据
  faultsSurvey: 'faults/survey', // 故障概况
  alarmBuildingCount: 'buildings/alarmBuildingCount', // 离线仓库数量
  faults: 'faults', // 故障信息查询
  faultsBuilding: 'buildings/fault', // 故障仓库
  faultsCode: 'faults/code', // 故障代码
  faultsRank: 'faults/rank', // 故障代码
  questionFaultRemove: 'faults/questionFaultRemove', // 移除问题里面的告警
  faultedDeviceCount: 'faultedDevices/faultedDeviceCount', // 黑名单设备数量
  classificationStatistics: 'faults/classificationStatistics', // 故障分类次数统计
  faultedDevices: 'faultedDevices', // 故障黑名单设备查询
  alarmsAbbreviation: 'alarms/abbreviation', // 离线仓库
  electricAlarmKind: 'alarms/electric_alarm_kind', // 电能表告警类型
  buildings: 'buildings', // 获取公司
  wxDevicesSearch: 'buildings/wxDevicesSearch', // 获取公司的设备
  getOssSign: 'workflows/getOssSign', // 获取OSS相关信息
  questionClassifications: 'questionClassifications', // 获取问题描述列表
  workflowQuestionSolutions: 'workflowQuestionSolutions', // 获取问题解决方案
  questions: 'questions', // 问题的相关操作
  wxQuestionUpdate: 'questions/wxQuestionUpdate', // 问题修改
  getUsers: 'questions/getUsers', // 获取问题提出人
  closeQuestion: 'questions/closeQuestion', // 关闭问题
  changeClassification: 'questions/changeClassification', // 修改问题分类
  changeRank: 'questions/changeRank', // 修改问题级别
  deviceRelations: 'deviceRelations', // 问题内设备操作
  finishQuestion: 'questions/finishQuestion', // 完结问题
  approveQuestion: 'questions/approveQuestion', // 审核问题
  addQuestion: 'questions/addQuestion', // 工单内添加问题
  removeQuestion: 'questions/removeQuestion', // 工单中移除问题
  immigrationQuestion: 'questions/immigrationQuestion', // 工单内移入问题
  questionRecords: 'questionRecords', // 添加问题记录
  wxQuestionRecordUpdate: 'questionRecords/wxQuestionRecordUpdate', // 修改问题记录
  questionConcerns: 'questionConcerns', // 关注问题
  concernDel: 'questionConcerns/concernDel', // 取消关注问题
  workflows: 'workflows', // 工单相关操作
  workflowProvince: 'workflows/workflowProvince', // 获取工单的省份
  wxWorkflowUpdate: 'workflows/wxWorkflowUpdate', // 修改工单
  attachments: 'attachments', // 附件相关操作
  getAfterSaleManager: 'workflows/getAfterSaleManager', // 获取售后经理
  getAfterSalePerson: 'workflows/getAfterSalePerson', // 获取售后人员
  changePart: 'partLists/changePart', // 获取更换部件
  changeParts: 'changeParts', // 提交更换部件
  wxChangePartUpdate: 'changeParts/wxChangePartUpdate', // 修改更换部件
  workflowSystemKeepRecords: 'workflowSystemKeepRecords', // 获取保养表
  buildingQuestion: 'questions/buildingQuestion', // 获取问题概况
  mineWorkflowCount: 'workflows/mineWorkflowCount', // 获取我的工单相关的数量
  addressBooks: 'addressBooks', // 获取通讯录列表
  locationUpdate: 'buildings/locationUpdate', // 更新仓库位置
  wxBuildingRecordUpdate: 'buildings/wxBuildingRecordUpdate', // 更新仓库记录
  constructionProblem: 'constructionProblem', // 施工问题
  constructionProblemKind: 'constructionProblemKind', // 施工问题类型
  constructionRank: 'constructionProblem/constructionRank', // 施工问题排名
  constructionClassRank: 'constructionProblem/constructionClassRank', // 施工问题分类排名
  constructionBuildingRank: 'constructionProblem/constructionBuildingRank' // 施工问题仓库排名
};
