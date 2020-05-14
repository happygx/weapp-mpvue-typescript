import Vue from "vue";
import axios from "axios";
import qs from "qs";
import { BaseUrl } from "@/config/index";

axios.defaults.timeout = 30000;
axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    let data =
      config.method === "GET" ? config.params : qs.stringify(config.data);
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
  function (request) {
    // request.headers.token = 'token=11124654654687';
    // console.log(request) // 请求成功
    return request;
  },
  function (error) {
    // console.log(error); // 请求失败
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    console.log(response.data.data); // 响应成功
    return response;
  },
  function (error) {
    // console.log(error); // 响应失败
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = axios;
