### Features

1. Zero / Minimal Webpack5 configration.
2. Out of box for react project.
3. Support CSR, SSR build
4. CLI and Nodejs interface.

### Usage

Let's take my another open source project [w-popover](https://github.com/leonwgc/w-popover) for example.

#### For DEV and CSR build.

1. dev command: node pack
2. build command: node pack --build

```js
/* filename: pack.js */
const { default: pack } = require('packw');
const argv = require('yargs').argv;
const path = require('path');

const isBuild = !!argv.build;

pack(!isBuild, {
  entry: {
    index: `./demo/index`,
  },
  output: {
    path: path.resolve(__dirname, !isBuild ? '.dev' : 'docs'),
    publicPath: '',
  },
  devServer: {
    port: 9101,
  },
  resolve: {
    alias: {
      'w-popover': path.resolve(__dirname, './src'),
    },
  },
});
```

#### For SSR and Prerender

1. Add a server side rendering entry.

```js
/* filename: index.ssr.jsx  */
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export default function () {
  return renderToString(<App />);
}
```

2. Add nodejs to generate a commonjs library to run above SSR function.

```js
// filename: pack.ssr.js
const { getNodeLib } = require('packw');
const chalk = require('chalk');

getNodeLib({ index: './demo/index.ssr.jsx' }, () => {
  console.log(chalk.greenBright('ssr library generated!'));
});
```

3. For Prerendering, please configuare the html template. Thus we can use templateContent function to dynamically inject the prerendered html content.

```js
// filename: index.tpl.js in root directory.
const path = require('path');
const fs = require('fs');
const ssrLibDir = 'ssr-lib';

module.exports = function (htmlWebpackPlugin) {
  let renderer = {};

  if (fs.existsSync(path.resolve(`./${ssrLibDir}/index.js`))) {
    renderer = require(`./${ssrLibDir}/index.js`).default;
  }

  let body = '';
  if (typeof renderer === 'function') {
    body = renderer?.();
  }

  return `
 <!doctype html>
 <html lang="zh-cn">
 <head>
	 <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui,viewport-fit=cover">
	 <meta name="format-detection" content="telephone=no, email=no"><meta name="apple-mobile-web-app-capable" content="yes">
	 <meta name="apple-touch-fullscreen" content="yes">
	 ${htmlWebpackPlugin.tags.headTags}
   <link rel="shortcut icon"/>
	 <title>w-popover demo</title>
 </head>
 <body>
	 <div id='root'>${body}</div>
	 <script>window.app ={};</script>
		 ${htmlWebpackPlugin.tags.bodyTags}
		 </body>
 </html>
 `;
};
```

4. The combined commands for prerendering

```
node pack.ssr && node pack --build
```

5. SSR with expressjs

 just like prerender, except for that we run the ssr function for each request. below is an example with express.js

```js
const express = require('express');
const app = express();
const path = require('path');
const ssrRenderer = require('./ssr-lib/index'); 
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
    }
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
