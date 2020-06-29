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
    {{ componentName }}
  </div>
</template>

<script lang="ts" src="./${dirName}.ts"></script>

<style lang="scss">
@import './${dirName}.scss'
</style>
`;

// ts 模版
const tsTep = `import { Component, Vue, Prop, Emit } from "vue-property-decorator"

@Component({
  name: '${dirName}'
})
export default class ${capPirName} extends Vue {
  // prop
  @Prop({
    required: false,
    default: ''
  }) name!: string

  // data
  private componentName: string = '${dirName}'

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

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Data {
  componentName: string
}

`;

fs.mkdirSync(`${basePath}/components/${capPirName}`); // mkdir

process.chdir(`${basePath}/components/${capPirName}`); // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep); // vue
fs.writeFileSync(`${dirName}.ts`, tsTep); // ts
fs.writeFileSync(`${dirName}.scss`, scssTep); // scss

// process.chdir(`${basePath}/types/components`) // cd components
// fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep) // interface

process.exit(0);
