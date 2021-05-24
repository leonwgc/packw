"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pack = exports.run = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _process = _interopRequireDefault(require("process"));

var _chalk = _interopRequireDefault(require("chalk"));

var _glob = _interopRequireDefault(require("glob"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _cssMinimizerWebpackPlugin = _interopRequireDefault(require("css-minimizer-webpack-plugin"));

var _reactRefreshWebpackPlugin = _interopRequireDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

var _webpackbar = _interopRequireDefault(require("webpackbar"));

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _tpl = _interopRequireDefault(require("./tpl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//#endregion
//#region  helper
var getProjectPath = function getProjectPath() {
  var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './';
  return _path["default"].join(_process["default"].cwd(), dir);
};

function exit(error) {
  console.log(_chalk["default"].red(error));

  _process["default"].exit(9);
} //#endregion
//#endregion
//#region style process
// type: less, sass, css


var getStyleLoaders = function getStyleLoaders() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'less';
  var isDev = arguments.length > 1 ? arguments[1] : undefined;
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
            implementation: require('sass'),
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
      loader: _miniCssExtractPlugin["default"].loader
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
      filename: "".concat(type, "/[name].[hash:8][ext]")
    }
  };
}; //#endregion
//#region html webpack


var getHtmlPluginsConfig = function getHtmlPluginsConfig() {
  var dirs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var isDev = arguments.length > 1 ? arguments[1] : undefined;

  // index.html tpl check & emit
  if (!_fs["default"].existsSync(getProjectPath('./index.html'))) {
    _fs["default"].writeFileSync(getProjectPath('./index.html'), _tpl["default"]);
  }

  var htmlsPlugins = [];

  var _iterator = _createForOfIteratorHelper(dirs),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var dir = _step.value;
      htmlsPlugins.push(new _htmlWebpackPlugin["default"](Object.assign({
        filename: "".concat(dir, ".html"),
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
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return htmlsPlugins;
}; //#endregion
//#region  config


var getConfig = function getConfig() {
  var isDev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var entry = arguments.length > 1 ? arguments[1] : undefined;
  var publicPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
  var entryKeys = Object.keys(entry);
  var htmlsPlugins = getHtmlPluginsConfig(entryKeys, isDev);
  var name = entryKeys.join('-');
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
    target: 'web',
    cache: isDev ? {
      type: 'filesystem',
      name: name,
      buildDependencies: {
        config: [__filename]
      },
      store: 'pack'
    } : false,
    module: {
      rules: [{
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: getBabelOptions(isDev)
        }
      }, {
        test: /\.less$/,
        use: getStyleLoaders('less', isDev)
      }, {
        test: /\.s[ac]ss$/i,
        use: getStyleLoaders('sass', isDev)
      }, {
        test: /\.css$/,
        use: getStyleLoaders('css', isDev)
      }, _objectSpread({
        test: /\.(png|jpg|gif|jpeg|svg)$/
      }, getAssetConfig('images')), _objectSpread({
        test: /\.(ttf|otf|woff|woff2|eot)$/
      }, getAssetConfig('fonts'))]
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
      runtimeChunk: {
        name: 'runtime'
      },
      moduleIds: isDev ? 'named' : 'deterministic',
      chunkIds: isDev ? 'named' : 'deterministic'
    },
    stats: 'errors-warnings',
    plugins: [new _cleanWebpackPlugin.CleanWebpackPlugin(), new _miniCssExtractPlugin["default"]({
      filename: "[name].[contenthash:6].css",
      chunkFilename: "[name].[contenthash:6].css"
    }), new _webpack["default"].DefinePlugin({
      __dev__: isDev
    }), new _webpackbar["default"]({
      name: 'packx'
    })].concat(_toConsumableArray(htmlsPlugins))
  };

  if (isDev) {
    config.plugins.push(new _reactRefreshWebpackPlugin["default"]({
      overlay: true
    }));
  } else {
    config.optimization = _objectSpread(_objectSpread({}, config.optimization), {}, {
      minimize: true,
      minimizer: [new _cssMinimizerWebpackPlugin["default"]()]
    });
  }

  return config;
}; //#endregion
//#region run


var runWebpack = function runWebpack(config) {
  var openFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'index';
  var isDev = arguments.length > 2 ? arguments[2] : undefined;
  var port = arguments.length > 3 ? arguments[3] : undefined;

  var _devServer = arguments.length > 4 ? arguments[4] : undefined;

  var devServer;

  if (isDev) {
    var compiler = (0, _webpack["default"])(config);

    var serverConfig = _objectSpread({
      publicPath: '/',
      compress: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      hot: true,
      inline: true,
      noInfo: true
    }, _devServer);

    var p = serverConfig.port || port;
    devServer = new _webpackDevServer["default"](compiler, serverConfig);
    devServer.listen(p, serverConfig.host, function (err) {
      if (err) {
        exit(err);
      }

      var serveUrl = "http://localhost:".concat(p, "/").concat(openFile, ".html");
      console.log(_chalk["default"].green("dev server: ".concat(serveUrl)));
    });
  } else {
    var _compiler = (0, _webpack["default"])(config);

    _compiler.run(function (err, stats) {
      if (err || stats.hasErrors()) {
        console.log(stats);
      }

      _compiler.close(function () {
        console.log(_chalk["default"].green('构建完成'));
      });
    });
  }

  ['SIGINT', 'SIGTERM'].forEach(function (sig) {
    _process["default"].on(sig, function () {
      if (devServer) {
        devServer.close();
      }

      _process["default"].exit();
    });
  });
}; //#endregion
//#region spa mode


var run = function run() {
  var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'index';
  var publicPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var isDev = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var port = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 9000;

  var s = _glob["default"].sync("./src/".concat(dir, "/index{.jsx,.js,.ts,.tsx}"));

  var isDir = true;

  if (!s.length) {
    s = _glob["default"].sync("./src/index{.jsx,.js,.ts,.tsx}");

    if (!s.length) {
      exit("can't find entry file");
    }

    isDir = false;
  }

  var entryFile = s[0];
  var config = getConfig(isDev, _defineProperty({}, dir, entryFile), publicPath);
  runWebpack(config, isDir ? dir : 'index', isDev, port, null);
}; //#endregion
//#region mpa mode


exports.run = run;

var pack = function pack() {
  var isDev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var configFile = getProjectPath('./packx.config.js');

  if (!_fs["default"].existsSync(configFile)) {
    exit("\u914D\u7F6E\u4E0D\u5B58\u5728:packx.config.js");
  }

  var custConfig = require(configFile);

  var entry = custConfig.entry,
      _custConfig$devServer = custConfig.devServer,
      devServer = _custConfig$devServer === void 0 ? {} : _custConfig$devServer,
      others = _objectWithoutProperties(custConfig, ["entry", "devServer"]);

  if (_typeof(entry) === 'object' && entry) {
    var keys = Object.keys(entry);

    if (keys.length) {
      var config = getConfig(isDev, entry);
      var mergedConfig = (0, _webpackMerge["default"])({}, config, others);
      return runWebpack(mergedConfig, keys[0], isDev, 9000, devServer);
    } else {
      exit('请配置entry');
    }
  } else {
    exit('请配置entry');
  }
}; //#endregion


exports.pack = pack;