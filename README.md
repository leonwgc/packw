### packw

Webpack5 react 打包构建,支持mpa,spa应用, 支持cli & node使用, demo参考 
[https://github.com/leonwgc/packw-demo](https://github.com/leonwgc/packw-demo)


##### cli开发 cli start dev server 

> npx packw start

#### cli构建 cli build 

> npx packw build

### node调用 node usage

```js
const { default: packw } = require('packw');
const argv = require('yargs').argv;
const chalk = require('chalk');
const path = require('path');

const isDev = !!argv.dev;

packw(
  isDev,
  {
    entry: {
      index: `./src/index`,
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    output: {
      path: path.resolve(__dirname, './dist'),
    },
  },
  () => {
    console.log(chalk.green('done'));
  },
);

```

### ssr 服务端渲染

> node pack.ssr.client && node pack.ssr.js && node app.js

#### ssr 构建流程

1. node端构建commonjs库, 放在ssr-lib目录,调用ReactDOMServer.renderToString 渲染html

> node打包命令:` node pack.ssr.js`

> 构建入口 /src/index.ssr.jsx 

```js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider, configureStore } from 'simple-redux-store';
import App from './App';

export const indexRender = (location, context) => {
  const store = configureStore({ name: 'server' });
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <App location={location} context={context} />
    </Provider>,
  );
};

```

2.  web端打包, 执行ReactDOM.hydrate , 打包结果放在dist目录,此时已经构建好css和js bundles , html内容等待node调用ejs注入（埋了一个注入点<?-html?>）

> 打包命令: node pack.ssr.client.js

> 打包入口 /src/index.jsx 

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, configureStore } from 'simple-redux-store';
import App from './App';

const store = configureStore({ name: 'client' }, __dev__);

ReactDOM.hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

```

3. 启动node服务，接受请求，调用node打包的commonjs渲染html,然后通过ejs注入到模板文件并发送给浏览器
    

```js
const express = require('express');
const app = express();
const path = require('path');
const ssrRenderer = require('./ssr-lib/index'); // pack.ssr.js 构建的commonjs模块， 导出了一个对象
app.disable('x-powered-by');
app.enable('trust proxy');

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.resolve(__dirname, 'dist'));

const distRoot = path.resolve(__dirname, 'dist');

app.use(express.static(distRoot));

app.use((req, res, next) => {
  const context = {};

  res.render(
    'index',
    { html: ssrRenderer.indexRender(req.url, context), delimiter: '?' },
    (err, str) => {
      if (err) {
        throw err;
      }
      res.send(str);
    },
  );
});

app.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send('server is down.');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.info(`==> 🍺  Express server running at localhost: ${PORT}`);
});

```
