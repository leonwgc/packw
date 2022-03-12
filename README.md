### w-pack

webpack5 打包构建

## 安装

用 [npm](https://npmjs.org/) / [yarn](https://yarnpkg.com) 安装:

    $ npm install -D w-pack
    $ yarn add -D w-pack

#### 特性

1. 基于最新的 webpack5
2. 支持 less,sass,css-in-js
3. 支持 spa/mpa
4. 支持 typescript
5. 支持 node 调用和 cli 调用
6. 支持 ssr
7. 支持自定义 webpack 配置

#### 用法

- 开发 w-pack start [-p port]
- 构建 w-pack build [-p publicPath]
- node 调用 (推荐，start/build 可以替代 create-react-app 使用 )
- ssr

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

#### 扩展 postcss 插件 demo

项目根目录添加 postcss.config.js， 以添加 postcss-plugin-px2rem 为例

```js
module.exports = (ctx) => {
  if (!/node_modules/.test(ctx.file)) {
    ctx.options.plugins.push(require('postcss-plugin-px2rem')({ rootValue: 100 }));
  }
};
```

### node 命令行用法（推荐）

w-pack 默认导出了一个 nodeApi, 函数签名如下

```js
/**
 * node自定义构建
 *
 * @export
 * @param {boolean} isDev 是否开发模式
 * @param {Configuration} config webpack Configuration配置
 * @param {() => void} [callback] 非开发模式编译完成的回调
 * @return {*}
 */
export default function w-pack(isDev: boolean, config: Configuration, callback?: () => void): void;

```

```js
const { default: pack } = require('w-pack');
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
    // 构建结束处理, isDev为false才会调用
  });

```

项目结构和打包输出如下图

![structure.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27201daa7a384f368d5f37060d846c07~tplv-k3u1fbpfcp-watermark.image)

#### ssr

ssr 和上述使用参考 w-pack-demo 库

项目代码参考 [https://github.com/leonwgc/w-pack-demo](https://github.com/leonwgc/w-pack-demo)
