export default {
  getOpenIdSessionKey: "getOpenidSessionKey", // 获取3rd_session
  wxLogin: "wxlogin", // 登录
  wxLogout: "wxlogout", // 退出
  collects: "collects", // 收藏菜单
  userCollectUpdate: "collects/userCollectUpdate", // 更新收藏菜单
  userCollectDel: "collects/userCollectDel", // 取消收藏菜单
  faultAlarm: "faults/fault_alarm", // 获取当前的告警和故障数
  projectOverview: "buildings/projectOverview", // 获取项目概况
  projectDataOverview: "buildings/projectDataOverview", // 获取当前数据概况
  buildingMessage: "buildings/buildingMessage", // 获取仓库信息
  energyDistribution: "gatherSystems/energyDistribution", // 获取能耗分布
  faultsDay: "faults/toDay", // 获取当日告警
  specificEnergyConsumption: "buildings/specificEnergyConsumption", // 获取单位能耗排名
  deviceRunStatus: "buildings/deviceRunStatus", // 获取当前设备运行情况
  alarms: "alarms", // 获取告警数据
  tree: "companies/tree", // 获取树
  userCompanyView: "buildings/userCompanyView", // 获取公司
  floorsPlan: "floors/getPlan", // 获取楼层平面图
  systemsPlan: "airConditionSystems/getPlan", // 获取系统平面图
  temperatureHumidity: "floors/devices/temperatureHumidity", // 获取设备的温湿度
  getcurdata: "gatherSystems/getcurdata", // 获取当前设备数据
  getFloorDevice: "gatherSystems/420661250/getFloorDevice", // 获取楼层设备数据
  pumpCurdata: "pumps/currentRunning", // 获取水泵当前数据
  gethisdata: "gatherSystems/gethisdata", // 获取设备历史数据
  floorOpenCount: "gatherSystems/floorOpenCount", // 获取楼层设备开机数量
  regionsOpenCount: "regions/openCount", // 获取区域设备开机数量
  floorRuntime: "gatherSystems/runTime", // 获取楼层设备运行时长
  regionsRuntime: "regions/runTime", // 获取区域设备运行时长
  devicesRuntime: "controlPanels/runTime", // 获取设备运行时长
  buildingEnergySurvey: "buildings/energySurvey", // 获取仓库的能耗概况
  systemEnergySurvey: "gatherSystems/energySurvey", // 获取系统的能耗概况
  floorElectricity: "floors/electricity", // 获取楼层电能表数据
  deviceElectricity: "gatherSystems/electricity", // 获取设备电能表数据
  electricMeter: "gatherSystems/electricMeter", // 获取电表数据
  energyCompare: "buildings/compare", // 获取仓库能耗对比的数据
  floorEnergy: "buildings/floorEnergy", // 获取仓库各个楼层的数据
  monthEnergy: "buildings/monthEnergy", // 获取仓库今年和去年各个月份的能耗数据
  buildingSurvey: "buildings/survey", // 获取仓库概况
  projectAllocation: "buildings/project_allocation", // 获取仓库区域分布概况
  coolNormal: "buildings/cool_normal", // 获取仓库阴凉和常温库的能耗排名概况
  deviceSurvey: "airConditions/survey", // 获取设备概况
  runtimeEnergy: "gatherSystems/runtime_energy", // 获取设备运行的能耗数据
  series: "series", // 获取产品系列
  products: "products", // 产品相关操作
  synchronous: "products/synchronous", // 产品同步
};
