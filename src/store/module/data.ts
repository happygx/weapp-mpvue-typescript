import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

export interface IData {
  Data: {};
}

@Module({ dynamic: true, store, name: 'request' })
class Data extends VuexModule implements IData {
  public Data: {} = {};

  @Action
  public PUSH_DATA_ASYNC(data: object) {
    this.PUSH_DATA(data);
  }

  @Mutation
  public PUSH_DATA(data: any) {
    Object.assign(this.Data, data);
  }
}

export const DataModule = getModule(Data);
