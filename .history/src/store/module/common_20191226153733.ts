import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';

export interface CommonData {
  companyName: string;
  companyId: number;
  alarmCount: number;
}

@Module({ dynamic: true, store, name: 'common' })
class Common extends VuexModule implements CommonData {
  public companyName: string = '华东医药股份有限公司';
  public companyId: number = 3;
  public alarmCount: number = 0;

  @Action
  public SET_COMPANY_ASYN(company: any) {
    this.SET_COMPANY(company);
  }

  @Mutation
  private SET_COMPANY(company: any) {
    this.companyName = company.name;
    this.companyId = company.id;
  }
}

export const CommonModule = getModule(Common);
