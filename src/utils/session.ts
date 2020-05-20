import { getOpenIdSessionKey } from '@/api/common';
import { UserModule } from '@/store/module/user';

export const getSession = () => {
  wx.login({
    success: (res) => {
      console.log(res);
      getOpenIdSessionKey({
        data: {
          code: res.code,
        },
      }).then((result: any) => {
        console.log(result);
        UserModule.SET_SESSION_ASYNC(result.third_session);
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
