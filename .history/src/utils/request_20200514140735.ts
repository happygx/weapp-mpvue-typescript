import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { BaseUrl, conmonPrams } from "@/config/index";
import requestConfig from "@/config/requestConfig";
import { UserModule } from "@/store/module/user";
import qs from "qs";
import Vue from "vue";

declare type Methods =
  | "GET"
  | "OPTIONS"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

const getRequestIdentify = (config: any) => {
  let url = config.url;
  return config.method === "get"
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data));
};

const tip = (msg: string) => {
  Vue.prototype.$message({
    message: msg,
    center: true,
    type: "error",
    duration: 3 * 1000,
    offset: 300,
  });
};

class HttpRequest {
  public pending: object; // 请求的url集合
  public constructor() {
    this.pending = {};
  }
  destroy(url: string) {
    delete this.pending[url];
    // 关闭全局的loading...
    if (!Object.keys(this.pending).length) {
      // tryHideFullScreenLoading();
    }
  }

  interceptors(instance: any, url?: string) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // console.log(config);
        // 将请求的url和参数拼接在一起
        let requestUrl = getRequestIdentify(config);
        if (url) {
          // config.cancelToken = new axios.CancelToken(cancel => {
          //   // 将页面上的所有请求的取消方法都存起来，当页面跳转时把为请求到的全都取消
          //   RequestModule.PUSH_TOKEN_ASYNC(cancel);
          //   if (this.pending[url] === requestUrl) {
          //     cancel('取消重复请求');
          //     return;
          //   }
          //   this.pending[url] = requestUrl;
          // });
        }

        // 在请求前统一添加headers信息
        // if (UserModule.session) {
        //   config.headers = {
        //     Authorization: "session " + UserModule.session,
        //   };
        // }

        // 添加全局的loading...
        if (!Object.keys(this.pending).length) {
          // showFullScreenLoading();
        }
        return Promise.resolve(config);
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // console.log(res);
        if (url) {
          this.destroy(url);
        }
        const { data, status } = res;
        if (data && status === 200) {
          // 请求成功
          return data.data;
        }
        return requestFail(res); // 失败回调
      },
      (error: any) => {
        if (error.message !== "取消重复请求") {
          if (url) {
            this.destroy(url);
          }
        }
        tip(error.response.data.msg);
        requestFail(error.response); // 失败回调
        return Promise.reject(error);
      }
    );
  }
  async request(options: AxiosRequestConfig) {
    const instance = axios.create();
    // console.log(instance);
    instance.defaults.adapter = function (options: AxiosRequestConfig) {
      return new Promise((resolve, reject) => {
        let method = options.method === undefined ? "GET" : options.method;
        let data =
          options.method === "get"
            ? options.params
            : qs.stringify(options.data);
        // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
        wx.request({
          url: options.url as string,
          method: method as Methods,
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
    await this.interceptors(instance, options.url);
    return instance(options);
  }
}

// 请求失败
const requestFail = (res: AxiosResponse) => {
  // console.log(res);
  const { data, status } = res;
  // token失效重新登录
  if (status === 401) {
    console.log(res);
    // 账户失效
    // UserModule.ResetToken();
    window.location.href = "/login";
    return false;
  } else {
    return Promise.reject({
      code: status,
      msg: data.msg || res.statusText,
    });
  }
};

// 合并axios参数
const conbineOptions = (opts: any): AxiosRequestConfig => {
  const _data = { ...conmonPrams, ...opts.data };
  const options = {
    method: opts.method || "GET",
    url: opts.url,
    headers: opts.headers,
    baseURL: BaseUrl,
    // timeout: 5000
  };
  return options.method !== "GET"
    ? Object.assign(options, { data: _data })
    : Object.assign(options, { params: _data });
};

const HTTP = new HttpRequest();

/**
 * 抛出整个项目的api方法
 */
const Api = (() => {
  const apiObj: any = {};
  const requestList: any = requestConfig;
  const fun = (opts: AxiosRequestConfig) => {
    return async (params: any = {}) => {
      // 在这里把opts的url赋值给params，是为了解决opts会缓存同一个接口不同请求方式里面的opts
      params.url = params.url === undefined ? opts.url : params.url;
      const newOpts = conbineOptions(params);
      const res = await HTTP.request(newOpts);
      console.log(res);
      return res;
    };
  };
  Object.keys(requestConfig).forEach((key) => {
    let opts = {
      url: requestList[key],
    };
    apiObj[key] = fun(opts);
  });
  return apiObj;
})();

export default Api as any;
