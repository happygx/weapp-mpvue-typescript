import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";

export interface IPermissionState {
  // routes: RouteConfig[];
  // dynamicRoutes: RouteConfig[];
}

@Module({ dynamic: true, store, name: "permission" })
class Permission extends VuexModule implements IPermissionState {
  // public routes: RouteConfig[] = [];
  // public dynamicRoutes: RouteConfig[] = [];
  // @Action
  // public GenerateRoutes() {
  //   let accessedRoutes: RouteConfig[] = filterAsyncRoutes(constantRoutes);
  //   this.SET_ROUTES(accessedRoutes);
  // }
  // @Mutation
  // private SET_ROUTES(routes: RouteConfig[]) {
  //   this.routes = routes;
  // }
}

export const PermissionModule = getModule(Permission);
