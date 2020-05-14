import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType;
  sidebar: {
    opened: boolean;
    sidebarToggle: boolean;
    moreMenuToggle: boolean;
    withoutAnimation: boolean;
  };
  size: string;
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: true,
    sidebarToggle: false,
    moreMenuToggle: false,
    withoutAnimation: false,
  };
  public device = DeviceType.Desktop;
  public size = 'medium';

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device);
  }

  @Action
  public ToggleSidebar(boolean: boolean) {
    this.TOGGLE_SIDEBAR(boolean);
  }

  @Action
  public ToggleMoremenu(boolean: boolean) {
    this.TOGGLE_MOREMENU(boolean);
  }

  @Action
  public CloseMenu(boolean: boolean) {
    this.TOGGLE_SIDEBAR(boolean);
    this.TOGGLE_MOREMENU(boolean);
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device;
  }

  @Mutation
  private TOGGLE_SIDEBAR(boolean: boolean) {
    this.sidebar.sidebarToggle = boolean;
  }

  @Mutation
  private TOGGLE_MOREMENU(boolean: boolean) {
    this.sidebar.moreMenuToggle = boolean;
  }
}

export const AppModule = getModule(App);
