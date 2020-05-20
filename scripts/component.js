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
    {{data.componentName}}
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Emit } from "vue-property-decorator"

  @Component({
    name: '${dirName}'
  })
  export default class Table extends Vue {
    // prop
    @Prop({
      required: false,
      default: ''
    }) name!: string

    // data
    private componentName: string = '${dirName}'

    // 全局vue.js不强制刷新或者重启时只创建一次,也就是说,created()只会触发一次
    created() {
      //
    }

    // 进入当前存在activated()函数的页面时,一进入页面就触发,可以用于列表数据等的刷新
    activated() {
      //
    }

    // 通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
    mounted() {
      //
    }

    init() {
      //
    }

  }
</script>

<style lang="scss" scoped>

  .${dirName}-wrap {
    width: 100%
  }
</style>

`;

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Data {
  componentName: string
}

`;

fs.mkdirSync(`${basePath}/components/${capPirName}`); // mkdir

process.chdir(`${basePath}/components/${capPirName}`); // cd views
fs.writeFileSync(`${capPirName}.vue`, VueTep); // vue

// process.chdir(`${basePath}/types/components`) // cd components
// fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep) // interface

process.exit(0);
