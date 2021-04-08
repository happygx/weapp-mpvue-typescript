/*
 * @Description:
 * @Author: happy
 * @Date: 2020-07-03 17:18:49
 * @LastEditTime: 2021-03-24 10:07:41
 * @LastEditors: happy
 */
import { getOpenIdSessionKey } from '@/api/common';
import { UserModule } from '@/store/module/user';

export const getSession = (callback?: () => void) => {
  wx.login({
    success: (res) => {
      getOpenIdSessionKey({
        data: {
          code: res.code,
        },
      })
        .then((result: any) => {
          UserModule.SET_SESSION_ASYNC(result.third_session);
          typeof callback === 'function' && callback();
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
  });
};

export const checkSession = () => {
  wx.checkSession({
    fail: () => {
      // session_key 已经失效，需要重新执行登录流程
      getSession();
    },
  });
};
