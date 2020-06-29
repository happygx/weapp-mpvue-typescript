const fs = require('fs');
const path = require('path');
const basePath = path.resolve(__dirname, '../src');

const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep ${capPirName}');
  process.exit(0);
}

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}-wrap">
    {{ ${capPirName}Name }}
  </div>
</template>

<script lang="ts" src="./${dirName}.ts"></script>

<style lang="scss">
@import './${dirName}.scss'
</style>

`;

// ts 模版
const tsTep = `import { Vue, Component } from "vue-property-decorator"
import {  } from "@/api/common"

@Component({
  name: '${dirName}',
  components: {

  }
})
export default class ${capPirName} extends Vue {
  // data
  private ${capPirName}Name: string = '${dirName}'

  // 监听页面加载
  onLoad() {
    this.init();
  }

  // 小程序 hook
  onShow() {
    //
  }

  // vue hook
  mounted() {
    //
  }

  // 初始化函数
  init() {
    //
  }

}
`;

// scss 模版
const scssTep = `@import '@/assert/css/common.scss';

.${dirName}-wrap {
  width: 100%;
}
`;

// json 模版
const json = `{
  "navigationBarTitleText": ""
}

`;

// main 模版
const main = `import Vue from "vue";
import App from "./${dirName}.vue";

const app = new Vue(App);
app.$mount();

`;

// vuex 模版
const vuexTep = `import { ${capPirName}State } from '@/types/views/${dirName}.interface'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as ${capPirName}Api from '@/api/${dirName}'

const state: ${capPirName}State = {
  author: '三毛'
}

// 强制使用getter获取state
const getters: GetterTree<${capPirName}State, any> = {
  author: (state: ${capPirName}State) => state.author
}

// 更改state
const mutations: MutationTree<${capPirName}State> = {
  // 更新state都用该方法
  UPDATE_STATE(state: ${capPirName}State, data: ${capPirName}State) {
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { return }
      state[key] = data[key]
    }
  }
}

const actions: ActionTree<${capPirName}State, any> = {
  UPDATE_STATE_ASYN({ commit, state: ${capPirName}State }, data: ${capPirName}State) {
    commit('UPDATE_STATE', data)
  },
  // GET_DATA_ASYN({ commit, state: LoginState }) {
  //   ${capPirName}.getData()
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}

`;

fs.mkdirSync(`${basePath}/pages/${dirName}`); // mkdir

process.chdir(`${basePath}/pages/${dirName}`); // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep); // vue
fs.writeFileSync(`${dirName}.ts`, tsTep); // ts
fs.writeFileSync(`${dirName}.scss`, scssTep); // scss
fs.writeFileSync(`main.json`, json); // json
fs.writeFileSync(`main.ts`, main); // main

// process.chdir(`${basePath}/store/module`); // cd store
// fs.writeFileSync(`${dirName}.ts`, vuexTep) // vuex

process.exit(0);
