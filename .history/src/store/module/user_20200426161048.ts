import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import { resetRouter } from '@/router';
import store from '@/store';
import { login, logout } from '@/api/index';
import { TagsViewModule } from '@/store/module/tags-view';
import { setCookie, getCookie, removeCookie } from '@/utils/common';

export interface IUserState {
  token: string;
  info: any;
  browse_permissions: string[] | boolean;
  handle_permissions: object | boolean;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token: string = getCookie('token')
    ? (getCookie('token') as string)
    : '';
  public info: any = getCookie('info')
    ? JSON.parse(getCookie('info') as string)
    : {};

  public browse_permissions: string[] = getCookie('browse_permissions')
    ? JSON.parse(getCookie('browse_permissions') as string)
    : [];
  public handle_permissions: object = getCookie('handle_permissions')
    ? JSON.parse(getCookie('handle_permissions') as string)
    : {};

  @Action
  public async Login(userInfo: object) {
    const data = await login({
      method: 'POST',
      data: userInfo,
    });
    if (!data) {
      throw Error('Verification failed, please Login again.');
    }
    setCookie('token', data.token);
    setCookie('info', data.info);
    setCookie('browse_permissions', data.browse_permissions);
    setCookie('handle_permissions', data.handle_permissions);

    this.SET_TOKEN(data.token);
    this.SET_INFO(data.info);
    this.SET_BROWSE_PERMISSION(data.browse_permissions);
    this.SET_HANDLE_PERMISSION(data.handle_permissions);
  }

  @Action
  public async LogOut() {
    await logout();
    this.ResetToken();
  }

  @Action
  public ResetToken() {
    removeCookie('token');
    removeCookie('info');
    removeCookie('browse_permissions');
    removeCookie('handle_permissions');
    resetRouter();
    TagsViewModule.delAllViews();
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  private SET_INFO(info: object) {
    this.info = info;
  }

  @Mutation
  private SET_BROWSE_PERMISSION(browse: string[]) {
    this.browse_permissions = browse;
  }

  @Mutation
  private SET_HANDLE_PERMISSION(handle: object) {
    this.handle_permissions = handle;
  }
}

export const UserModule = getModule(User);
