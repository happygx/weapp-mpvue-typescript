import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

export interface RequestUrl {
  cancelList: any[];
}

@Module({ dynamic: true, store, name: 'request' })
class Request extends VuexModule implements RequestUrl {
  public cancelList: any[] = [];

  @Action
  public PUSH_TOKEN_ASYNC(cancel: any) {
    this.PUSH_TOKEN(cancel);
  }

  @Action
  public CLEAR_TOKEN_ASYNC() {
    this.CLEAR_TOKEN();
  }

  @Mutation
  private PUSH_TOKEN(cancel: any) {
    this.cancelList.push(cancel);
  }

  @Mutation
  private CLEAR_TOKEN() {
    this.cancelList.forEach(item => {
      item('路由跳转取消请求');
    });
    this.cancelList = [];
  }
}

export const RequestModule = getModule(Request);
