### packx

基于 webpack 开发/打包工具

#### 特性
1. 基于webpack5
2. 支持less,sass (sass为dart-sass)
3. 支持spa/mpa开发和构建
4. 支持typescript 
5. 支持自定义html模板和自动生成html入口
6. 支持react hmr
7. 构建支持自定义publicPath
8. 开发支持自定义端口号
9. 支持自定义postcss, 比如px2rem, px2viewport

#### 用法

- 开发 packx start dir/file [-p port]
- 构建 packx build dir/file [-p publicPath]


#### 入口在 ./src目录下,比如./src/index.jsx

```js
 --src
    -index.jsx
```

运行 packx start index

#### 入口在 ./src目录下,比如./src/demo.jsx

```js
 --src
    -demo.tsx
```

运行 packx start demo


#### 对于mpa多目录应用, 入口在 ./src/page1/index 目录下,比如./src/page1/index.jsx
```js
 --src
    --page1
        -index.jsx
```

运行 packx start page1

##### 入口html, 如果项目不包含index.html ，默认会生成index.html,可以自定义html结构

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

#### 扩展postcss插件
项目根目录添加 postcss.config.js， 以添加px2viewport 为例

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
