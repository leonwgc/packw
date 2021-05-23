"use strict";

var _sliceInstanceProperty = require("@babel/runtime-corejs3/core-js/instance/slice");

var _Array$from = require("@babel/runtime-corejs3/core-js/array/from");

var _Symbol = require("@babel/runtime-corejs3/core-js/symbol");

var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");

var _Array$isArray = require("@babel/runtime-corejs3/core-js/array/is-array");

var _Object$keys2 = require("@babel/runtime-corejs3/core-js/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");

var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js/object/define-properties");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.pack = exports.run = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/assign"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/for-each"));

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

function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) { symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context6; _forEachInstanceProperty2(_context6 = ownKeys(Object(source), true)).call(_context6, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context7; _forEachInstanceProperty2(_context7 = ownKeys(Object(source))).call(_context7, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (_Array$isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { var _context5; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context5 = Object.prototype.toString.call(o)).call(_context5, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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
      htmlsPlugins.push(new _htmlWebpackPlugin["default"]((0, _assign["default"])({
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
  var _context;

  var isDev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var entry = arguments.length > 1 ? arguments[1] : undefined;
  var publicPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
  var entryKeys = (0, _keys["default"])(entry);
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
    plugins: (0, _concat["default"])(_context = [new _cleanWebpackPlugin.CleanWebpackPlugin(), new _miniCssExtractPlugin["default"]({
      filename: "[name].[contenthash:6].css",
      chunkFilename: "[name].[contenthash:6].css"
    }), new _webpack["default"].DefinePlugin({
      __dev__: isDev
    }), new _webpackbar["default"]({
      name: 'packx'
    })]).call(_context, (0, _toConsumableArray2["default"])(htmlsPlugins))
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
  var _context4;

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
    devServer.listen(p, serverConfig.host, /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err) {
        var _context2;

        var serveUrl;
        return _regenerator["default"].wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (err) {
                  exit(err);
                }

                serveUrl = (0, _concat["default"])(_context2 = "http://localhost:".concat(p, "/")).call(_context2, openFile, ".html");
                console.log(_chalk["default"].green("dev server: ".concat(serveUrl)));

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
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

  (0, _forEach["default"])(_context4 = ['SIGINT', 'SIGTERM']).call(_context4, function (sig) {
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
  var config = getConfig(isDev, (0, _defineProperty2["default"])({}, dir, entryFile), publicPath);
  runWebpack(config, isDir ? dir : 'index', isDev, port, null);
}; //#endregion
//#region mpa mode


exports.run = run;

var pack = function pack() {
  var isDev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9000;
  var publicPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
  var configFile = getProjectPath('./packx.config.js');

  if (!_fs["default"].existsSync(configFile)) {
    exit("\u914D\u7F6E\u4E0D\u5B58\u5728:packx.config.js");
  }

  var custConfig = require(configFile);

  var entry = custConfig.entry,
      _custConfig$devServer = custConfig.devServer,
      devServer = _custConfig$devServer === void 0 ? {} : _custConfig$devServer,
      others = (0, _objectWithoutProperties2["default"])(custConfig, ["entry", "devServer"]);

  if ((0, _typeof2["default"])(entry) === 'object' && entry) {
    var keys = (0, _keys["default"])(entry);

    if (keys.length) {
      var config = getConfig(isDev, entry, publicPath);
      var mergedConfig = (0, _webpackMerge["default"])(config, others);
      return runWebpack(mergedConfig, keys[0], isDev, port, devServer);
    }
  }

  exit('1');
}; //#endregion


exports.pack = pack;