/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-04-26 14:14:03
 * @LastEditors: happy
 */
import { getOpenIdSessionKey } from '@/api/common';
import { UserModule } from '@/store/module/login';

export const getSession = () => {
  wx.login({
    success: res => {
      getOpenIdSessionKey({
        data: {
          code: res.code
        }
      })
        .then((result: any) => {
          UserModule.SET_SESSION_ASYNC(result.third_session);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  });
};

export const checkSession = () => {
  wx.checkSession({
    fail: () => {
      // session_key 已经失效，需要重新执行登录流程
      getSession();
    }
  });
};
