"use strict";
/* eslint-disable no-console */

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.getConfig = exports.injectHtmlToRootNode = exports.getSsrLib = void 0; //#region require

var path_1 = __importDefault(require("path"));

var fs_1 = __importDefault(require("fs"));

var process_1 = __importDefault(require("process"));

var chalk_1 = __importDefault(require("chalk"));

var glob_1 = __importDefault(require("glob"));

var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));

var css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));

var react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

var webpackbar_1 = __importDefault(require("webpackbar"));

var clean_webpack_plugin_1 = require("clean-webpack-plugin");

var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));

var webpack_1 = __importDefault(require("webpack"));

var webpack_merge_1 = __importDefault(require("webpack-merge"));

var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));

var address_1 = __importDefault(require("address"));

var lib_1 = require("./lib");

Object.defineProperty(exports, "getSsrLib", {
  enumerable: true,
  get: function get() {
    return lib_1.getSsrLib;
  }
});
Object.defineProperty(exports, "injectHtmlToRootNode", {
  enumerable: true,
  get: function get() {
    return lib_1.injectHtmlToRootNode;
  }
});

var tpl_1 = __importDefault(require("./tpl")); //#endregion
//#region  helper


var getProjectPath = function getProjectPath(dir) {
  if (dir === void 0) {
    dir = './';
  }

  return path_1.default.join(process_1.default.cwd(), dir);
};

function exit(error) {
  console.log(chalk_1.default.red(error));
  process_1.default.exit(9);
} //#endregion
//#endregion
//#region style process
// type: less, sass, css


var getStyleLoaders = function getStyleLoaders(type, isDev) {
  if (type === void 0) {
    type = 'less';
  }

  var loaders = [{
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: isDev
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        })],
        sourceMap: isDev
      }
    }
  }];

  switch (type) {
    case 'less':
      {
        loaders.push({
          loader: require.resolve('less-loader'),
          options: {
            lessOptions: {
              relativeUrls: false,
              javascriptEnabled: true
            },
            sourceMap: isDev
          }
        });
        break;
      }

    case 'sass':
      {
        loaders.push({
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: isDev
          }
        });
        break;
      }
  }

  if (isDev) {
    loaders.unshift({
      loader: require.resolve('style-loader')
    });
  } else {
    loaders.unshift({
      loader: mini_css_extract_plugin_1.default.loader
    });
  }

  return loaders;
}; //#endregion
//#region  babel config


var getBabelOptions = function getBabelOptions(isDev) {
  var plugins = [[require.resolve('@babel/plugin-transform-runtime')], [require.resolve('@babel/plugin-proposal-decorators'), {
    legacy: true
  }], [require.resolve('@babel/plugin-proposal-class-properties'), {
    loose: false
  }]];

  if (isDev) {
    plugins.push([require.resolve('react-refresh/babel')]);
  }

  return {
    cacheDirectory: true,
    presets: [[require.resolve('@babel/preset-env'), {
      modules: false
    }], require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')],
    plugins: plugins
  };
}; //#endregion
//#region static asset


var getAssetConfig = function getAssetConfig(type) {
  return {
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024
      }
    },
    generator: {
      filename: type + "/[name].[hash:8][ext]"
    }
  };
}; //#endregion
//#region html webpack


var getHtmlPluginsConfig = function getHtmlPluginsConfig(dirs, isDev) {
  if (dirs === void 0) {
    dirs = [];
  } // index.html tpl check & emit


  if (!fs_1.default.existsSync(getProjectPath('./index.html'))) {
    fs_1.default.writeFileSync(getProjectPath('./index.html'), tpl_1.default);
  }

  var htmlsPlugins = [];

  for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
    var dir = dirs_1[_i];
    htmlsPlugins.push(new html_webpack_plugin_1.default(Object.assign({
      filename: dir + ".html",
      template: getProjectPath('index.html'),
      chunks: [dir, 'vendor', 'common', 'runtime']
    }, !isDev ? {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    } : undefined)));
  }

  return htmlsPlugins;
}; //#endregion
//#region  config


var getConfig = function getConfig(isDev, entry, publicPath, target) {
  if (isDev === void 0) {
    isDev = true;
  }

  if (publicPath === void 0) {
    publicPath = '/';
  }

  if (target === void 0) {
    target = 'web';
  }

  var entryKeys = Object.keys(entry);
  var isNodeTarget = target === 'node';
  var htmlsPlugins = isNodeTarget ? [] : getHtmlPluginsConfig(entryKeys, isDev);
  var name = entryKeys.join('-');
  var styleLoaders = !isNodeTarget ? [{
    test: /\.less$/,
    use: getStyleLoaders('less', isDev)
  }, {
    test: /\.s[ac]ss$/i,
    use: getStyleLoaders('sass', isDev)
  }, {
    test: /\.css$/,
    use: getStyleLoaders('css', isDev)
  }] : [{
    test: /\.(less|sass|scss|css)$/,
    use: require.resolve('./ignore')
  }];
  var plugins = [new clean_webpack_plugin_1.CleanWebpackPlugin(), new webpack_1.default.DefinePlugin({
    __dev__: isDev
  }), new webpackbar_1.default({
    name: 'packx'
  })];

  if (!isNodeTarget) {
    plugins.push(new mini_css_extract_plugin_1.default({
      filename: "[name].[contenthash:6].css",
      chunkFilename: "[name].[contenthash:6].css"
    }));
    plugins.push.apply(plugins, htmlsPlugins);
  }

  var config = {
    mode: isDev ? 'development' : 'production',
    bail: !isDev,
    entry: entry,
    output: {
      path: getProjectPath('./dist'),
      chunkFilename: "[name].[contenthash:6].js",
      filename: isDev ? '[name].js' : "[name].[contenthash:6].js",
      publicPath: publicPath
    },
    devtool: isDev ? 'cheap-module-source-map' : false,
    target: target,
    cache: isDev ? {
      type: 'filesystem',
      name: name,
      buildDependencies: {
        config: [__filename]
      },
      store: 'pack'
    } : {
      type: 'filesystem',
      name: name + '-prd',
      buildDependencies: {
        config: [__filename]
      },
      store: 'pack'
    },
    module: {
      rules: __spreadArray([{
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: getBabelOptions(isDev)
        }
      }, __assign({
        test: /\.(png|jpg|gif|jpeg|svg)$/
      }, getAssetConfig('images')), __assign({
        test: /\.(ttf|otf|woff|woff2|eot)$/
      }, getAssetConfig('fonts'))], styleLoaders, true)
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '~': getProjectPath('./src'),
        '@': getProjectPath('./src')
      }
    },
    optimization: {
      splitChunks: {
        name: false,
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10
          }
        }
      },
      runtimeChunk: isNodeTarget ? false : {
        name: 'runtime'
      },
      moduleIds: isDev ? 'named' : 'deterministic',
      chunkIds: isDev ? 'named' : 'deterministic'
    },
    stats: 'errors-warnings',
    plugins: plugins
  };

  if (isDev) {
    config.plugins.push(new react_refresh_webpack_plugin_1.default({
      overlay: true
    }));
  } else {
    config.optimization = __assign(__assign({}, config.optimization), {
      minimize: true,
      minimizer: [new css_minimizer_webpack_plugin_1.default(), '...']
    });
  }

  return config;
};

exports.getConfig = getConfig; //#endregion
//#region run

var runWebpack = function runWebpack(config, openFile, isDev, devPort, devServerConfig, callback) {
  if (openFile === void 0) {
    openFile = 'index';
  }

  var devServer;

  if (isDev) {
    var compiler = (0, webpack_1.default)(config);

    var serverConfig = __assign({
      publicPath: '/',
      compress: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      hot: true,
      inline: true,
      noInfo: true
    }, devServerConfig);

    var port_1 = serverConfig.port || devPort;
    devServer = new webpack_dev_server_1.default(compiler, serverConfig);
    devServer.listen(port_1, serverConfig.host, function (err) {
      if (err) {
        exit(err);
      }

      var page = "" + (openFile === 'index' ? '' : openFile + '.html');
      var serveUrl = "http://localhost:" + port_1 + "/" + page;
      var serverUrlIp = "http://" + address_1.default.ip() + ":" + port_1 + "/" + page;
      console.log();
      console.log(chalk_1.default.cyan('dev server running at:'));
      console.log();
      console.log('> Local:', chalk_1.default.green("" + serveUrl));
      console.log();
      console.log('> Network:', chalk_1.default.green("" + serverUrlIp));
    });
  } else {
    var compiler_1 = (0, webpack_1.default)(config);
    compiler_1.run(function (err, stats) {
      if (err || stats.hasErrors()) {
        console.log(stats);
      }

      compiler_1.close(function () {
        console.log(chalk_1.default.green('构建完成'));
        callback === null || callback === void 0 ? void 0 : callback();
      });
    });
  }

  ['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process_1.default.on(sig, function () {
      if (devServer) {
        devServer.close();
      }

      process_1.default.exit();
    });
  });
}; //#endregion
//#region spa mode


var run = function run(dir, publicPath, isDev, port) {
  var _a;

  if (dir === void 0) {
    dir = 'index';
  }

  if (publicPath === void 0) {
    publicPath = '/';
  }

  if (isDev === void 0) {
    isDev = true;
  }

  if (port === void 0) {
    port = 9000;
  }

  var s = glob_1.default.sync("./src/" + dir + "/index{.jsx,.js,.ts,.tsx}");
  var isDir = true;

  if (!s.length) {
    s = glob_1.default.sync("./src/index{.jsx,.js,.ts,.tsx}");

    if (!s.length) {
      exit("\u5165\u53E3\u6587\u4EF6\u672A\u627E\u5230 : " + getProjectPath('./src/index'));
    }

    isDir = false;
  }

  var entryFile = s[0];
  var config = (0, exports.getConfig)(isDev, (_a = {}, _a[dir] = entryFile, _a), publicPath);
  runWebpack(config, isDir ? dir : 'index', isDev, port);
};

exports.run = run; //#endregion
//#region mpa mode

/**
 * node自定义构建
 *
 * @export
 * @param {boolean} isDev 是否开发模式
 * @param {Configuration} config webpack Configuration配置
 * @param {() => void} [callback] 非开发模式编译完成的回调
 * @return {*}
 */

function packx(isDev, config, callback) {
  var _a = config,
      entry = _a.entry,
      _b = _a.devServer,
      devServer = _b === void 0 ? {} : _b,
      others = __rest(_a, ["entry", "devServer"]);

  if (typeof entry === 'object' && entry) {
    var keys = Object.keys(entry);

    if (keys.length) {
      var _config = (0, exports.getConfig)(isDev, entry);

      var mergedConfig = (0, webpack_merge_1.default)({}, _config, others);
      return runWebpack(mergedConfig, keys[0], isDev, 9000, devServer, callback);
    } else {
      exit('请配置entry');
    }
  } else {
    exit('请配置entry');
  }
}

exports.default = packx; //#endregion