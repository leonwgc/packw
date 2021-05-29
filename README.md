### packx

基于 webpack5 开发/打包工具

#### 特性

1. 基于 webpack5
2. 支持 less,sass
3. 支持 spa/mpa 开发和构建
4. 支持 typescript
5. 支持自定义 html 模板和自动生成 html 入口
6. 支持 react hmr
7. 支持扩展 postcss, 比如 px2rem, px2viewport
8. 支持自定义配置，覆盖默认 webpack config (基于 webpack merge 算法)
9. 支持 node api 调用和命令行调用
10. 支持ssr

#### 用法

- 开发 packx start dir/file [-p port]
- 构建 packx build dir/file [-p publicPath]
- 自定义 packx run [--build 构建输出],配置 packx.config.js
- js api 调用

#### 入口在 ./src 目录下,比如./src/index.jsx

```js
--src - index.jsx;
```

运行 packx start index

#### 入口在 ./src 目录下,比如./src/demo.jsx

```js
--src - demo.tsx;
```

运行 packx start demo

#### 对于 mpa 多目录应用, 入口在 ./src/page1/index 目录下,比如./src/page1/index.jsx

```js
--src;
--page1 - index.jsx;
```

运行 packx start page1

##### 入口 html, 如果项目不包含 index.html ，默认会生成 index.html,可以自定义 html 结构

```js
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui,viewport-fit=cover"
    />
    <meta name="format-detection" content="telephone=no, email=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-touch-fullscreen" content="yes" />
    <title></title>
  </head>
  <body style="font-size: 14px">
    <div id="root"></div>
  </body>
</html>

```

#### 扩展 postcss 插件

项目根目录添加 postcss.config.js， 以添加 px2viewport 为例

```js
module.exports = (ctx) => {
  if (!/node_modules/.test(ctx.file)) {
    ctx.options.plugins.push([
      require('postcss-px-to-viewport'),
      {
        unitToConvert: 'px',
        viewportWidth: 375,
        unitPrecision: 5,
        propList: ['*'],
        viewportUnit: 'vw',
        fontViewportUnit: 'vw',
        selectorBlackList: ['ignore'],
        minPixelValue: 1,
        mediaQuery: false,
        replace: true,
        exclude: [/node_modules/],
        include: undefined,
        landscape: false,
        landscapeUnit: 'vw',
      },
    ]);
  }
};
```

#### 通过 packx.config.js 自定义配置

注意，除了 entry 限制为 object 外， 配置项和 webpack 配置一致
下面通过自定义配置 packx.config.js 实现了 mpa 项目的打包

```js
const path = require('path');

module.exports = {
  entry: {
    h5: './src/h5/index',
    pc: './src/pc/index',
  },
  output: {
    path: path.resolve(__dirname, './dist/packx-demo'),
    publicPath: '',
  },
};
```

### node 命令行用法

packx 默认导出了一个 nodeApi, 函数签名如下, Configuration 为 webpack 配置对象

```js
export default function nodeApi(isDev: boolean, config: Configuration, callback?: () => void): void;
```

```js
const { default: pack } = require('packx');
...

pack(isDev, {
  entry: {
    index: `./src/index`,
  },
  devServer: {
    port: 3000
  },
  output: {
    path: getDist('dist'),
    publicPath,
  },
}, () => {
    // 构建结束处理
  });

```

项目结构和打包输出如下图

![structure.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27201daa7a384f368d5f37060d846c07~tplv-k3u1fbpfcp-watermark.image)

项目代码参考 [https://github.com/leonwgc/packx-demo](https://github.com/leonwgc/packx-demo)
