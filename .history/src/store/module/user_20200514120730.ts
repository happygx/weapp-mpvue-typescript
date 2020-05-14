import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import {setStorage,getStorage,} from '@/utils/common'

export interface IUserState {
  session: string;
  // info: any;
  // browse_permissions: string[] | boolean;
  // handle_permissions: object | boolean;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
  public session: string =

  @Action
  public async Login(userInfo: object) {
    // const data = await login({
    //   method: 'POST',
    //   data: userInfo,
    // });
    // if (!data) {
    //   throw Error('Verification failed, please Login again.');
    // }
  }

  @Action
  public async LogOut() {
    // this.ResetToken();
  }

  @Mutation
  private SET_TOKEN(token: string) {
    // this.token = token;
  }

  @Mutation
  private SET_INFO(info: object) {
    // this.info = info;
  }
}

export const UserModule = getModule(User);
