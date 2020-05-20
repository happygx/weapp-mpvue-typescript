import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import { setStorage, getStorage, removeStorage } from '@/utils/common';
import { wxLogin, wxLogout } from '@/api/common';

export interface IUserState {
  session: string | boolean;
  info: object | boolean;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public session: string | boolean = getStorage('session', true);
  public info: object | boolean = getStorage('info', true);

  @Action
  public async Login(form: object) {
    console.log(form);
    const res = await wxLogin({
      method: 'POST',
      data: form,
    });
    console.log(res);

    if (!res) {
      throw Error('Verification failed, please Login again.');
    }
    this.SET_INFO(res.info);
  }

  @Action
  public async LogOut(callback: () => void) {
    const res = await wxLogout();
    this.ResetToken();
    callback();
  }

  @Action
  public ResetToken() {
    this.SET_INFO(false);
    removeStorage('info');
  }

  @Action
  public async SET_SESSION_ASYNC(session: string) {
    this.SET_SESSION(session);
  }

  @Action
  public async SET_INFO_ASYNC(info: object) {
    this.SET_INFO(info);
  }

  @Mutation
  private SET_SESSION(session: string | boolean) {
    this.session = session;
    setStorage('session', session);
  }

  @Mutation
  private SET_INFO(info: object | boolean) {
    this.info = info;
    setStorage('info', info);
  }
}

export const UserModule = getModule(User);
