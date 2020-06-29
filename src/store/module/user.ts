import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';
import { setStorage, getStorage } from '@/utils/common';
import { getSession } from '@/utils/session';

export interface IUserState {
  session: string | boolean;
  info: any;
  browse: string[];
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public session: string | boolean = getStorage('session', true);
  public info: any = getStorage('info', true);
  public browse: string[] = getStorage('browse', true);

  @Action
  public ResetToken() {
    this.SET_SESSION(false);
    this.SET_INFO(false);
    this.SET_BROWSE([]);
    wx.clearStorage();
    getSession();
  }

  @Action
  public async SET_SESSION_ASYNC(session: string) {
    this.SET_SESSION(session);
  }

  @Action
  public async SET_INFO_ASYNC(info: object) {
    this.SET_INFO(info);
  }

  @Action
  public async SET_BROWSE_ASYNC(browse: []) {
    this.SET_BROWSE(browse);
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

  @Mutation
  private SET_BROWSE(browse: []) {
    this.browse = browse;
    setStorage('browse', browse);
  }
}

export const UserModule = getModule(User);
