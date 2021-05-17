import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { BaseUrl } from '@/config/index';
import requestConfig from '@/config/requestConfig';
import { UserModule } from '@/store/module/login';
import { getSession } from './session';
import { tip } from './common';

declare type Methods = 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

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
        // 在请求前统一添加headers信息
        if (UserModule.session) {
          config.headers = {
            Authorization: 'session ' + UserModule.session
          };
        }

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
        const { data, statusCode } = res as any;
        if (data && /^2/.test(statusCode)) {
          // 请求成功
          return data.data;
        }
        return requestFail(res); // 失败回调
      },
      (error: any) => {
        requestFail(error.response); // 失败回调
        return Promise.reject(error);
      }
    );
  }
  async request(options: AxiosRequestConfig) {
    const instance = axios.create();
    // 直接使用axios报错，因为微信小程序必须走wx.request发送交易，因此需要使用adapter(适配器)
    instance.defaults.adapter = (config: AxiosRequestConfig) => {
      return new Promise((resolve, reject) => {
        let data = config.data === undefined ? '{}' : config.data;
        // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
        wx.request({
          url: BaseUrl + config.url,
          method: config.method as Methods,
          header: config.headers,
          data: JSON.parse(data),
          success: res => {
            return resolve(res as any);
          },
          fail: err => {
            return reject(err);
          }
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
  const { data, statusCode } = res as any;
  tip(data.msg || '请求失败');

  if (statusCode === 401) {
    // 账户失效
    UserModule.ResetToken();
    throw new Error('请重新登录');
  } else if (statusCode === 412) {
    // session失效重新获取
    return getSession();
  } else {
    return Promise.reject({
      code: status,
      msg: data.msg || res.statusText
    });
  }
};

const HTTP = new HttpRequest();

/**
 * 抛出整个项目的api方法
 */
const Api = (() => {
  const apiObj: any = {};
  const requestList: any = requestConfig;
  const fun = (opts: AxiosRequestConfig) => {
    return (params: any = {}) => {
      // 在这里把opts的url赋值给params，是为了解决opts会缓存同一个接口不同请求方式里面的opts
      params.url = params.url === undefined ? opts.url : params.url;
      const res = HTTP.request(params);
      return res;
    };
  };
  Object.keys(requestConfig).forEach(key => {
    let opts = {
      url: requestList[key]
    };
    apiObj[key] = fun(opts);
  });
  return apiObj;
})();

export default Api as any;
