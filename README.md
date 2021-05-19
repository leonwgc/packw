### packx

基于 webpack 开发/打包工具

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

#####  如果项目不包含index.html ，默认会生成index.html， 如果包含，则不会生成， 可以自定义html结构

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
