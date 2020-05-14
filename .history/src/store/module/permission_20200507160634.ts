import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import { RouteConfig } from 'vue-router';
import { constantRoutes, asyncRoutes } from '@/router';
import store from '@/store';
import { UserModule } from './user';

const hasPermission = (route: RouteConfig[]) => {
  // console.log(route);
  const res: RouteConfig[] = [];
  for (let item of route) {
    if (UserModule.browse_permissions.includes(item.name as string)) {
      res.push(item);
    }
    if (UserModule.info.group === '养护员') {
      if (item.meta && item.meta.title === '监控平面图') {
        item.meta.affix = true;
      }
    }
  }
  return res;
};

const filterAsyncRoutes = (routes: RouteConfig[]) => {
  const res: RouteConfig[] = [];
  for (let i = 0; i < routes.length; i++) {
    const r = { ...routes[i] };
    if (r.children) {
      r.children = hasPermission(r.children);
      if (r.children.length === 0) {
        routes.splice(i, 1);
        i--;
      } else {
        res.push(r);
      }
    }
  }
  return res;
};

export interface IPermissionState {
  routes: RouteConfig[];
  dynamicRoutes: RouteConfig[];
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = [];
  public dynamicRoutes: RouteConfig[] = [];

  @Action
  public GenerateRoutes() {
    let accessedRoutes: RouteConfig[] = filterAsyncRoutes(constantRoutes);
    this.SET_ROUTES(accessedRoutes);
  }

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = routes;
  }
}

export const PermissionModule = getModule(Permission);
