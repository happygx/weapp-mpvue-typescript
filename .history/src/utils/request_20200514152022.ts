import axios from "axios";
import qs from "qs";
import { BaseUrl } from "@/config/index";

axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    let data =
      config.method === "get"
        ? JSON.parse(config.data)
        : qs.stringify(config.data);
    // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
    wx.request({
      url: BaseUrl + config.url,
      method: config.method as any,
      data: data,
      success: (res) => {
        return resolve(res as any);
      },
      fail: (err) => {
        return reject(err);
      },
    });
  });
};

// 请求拦截器
axios.interceptors.request.use(
  (request) => {
    console.log("请求成功");
    // request.headers.token = 'token=11124654654687';
    // console.log(request) // 请求成功
    return request;
  },
  (error) => {
    // console.log(error); // 请求失败
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log("响应成功");
    // console.log(response.data.data); // 响应成功
    return response;
  },
  (error) => {
    // console.log(error); // 响应失败
    return Promise.reject(error);
  }
);

export default axios;
