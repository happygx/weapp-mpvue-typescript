module.exports = {
  printWidth: 100, // 超过最大值换行
  useTabs: false, // 缩进不使用tab，使用空格
  tabWidth: 2, // 缩进字节数
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  proseWrap: 'preserve', // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  quoteProps: 'as-needed', // 对象的 key 仅在必要时用引号
  jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
  jsxBracketSameLine: false, // 在jsx中把'>' 是否单独放一行
  trailingComma: 'none', // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  arrowParens: 'avoid', //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  endOfLine: 'auto', // 结尾是 \n \r \n\r auto
  htmlWhitespaceSensitivity: 'css', // 根据显示样式决定 html 要不要折行
  ignorePath: '.prettierignore', // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
};