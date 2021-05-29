"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.injectHtmlToRootNode = exports.getSsrLib = void 0;

var _pack = require("./pack");

var _chalk = _interopRequireDefault(require("chalk"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _process = require("process");

var getProjectPath = function getProjectPath() {
  var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './';
  return _path["default"].join(process.cwd(), dir);
}; // get a ssr commonjs2 lib to render html string


var getSsrLib = function getSsrLib(entry, callback) {
  var config = (0, _pack.getConfig)(false, entry, '', 'node');
  var ssrConfig = {
    entry: entry,
    externals: [(0, _webpackNodeExternals["default"])()],
    output: {
      path: getProjectPath('./ssr-lib'),
      filename: '[name].js',
      library: {
        type: 'commonjs2'
      }
    }
  };
  var mergeConfig = (0, _webpackMerge["default"])({}, config, ssrConfig);
  var compiler = (0, _webpack["default"])(mergeConfig);
  compiler.run(function (err, stats) {
    if (err || stats.hasErrors()) {
      console.log(err.stack || err.message || err);
    }

    compiler.close(function () {
      console.log(_chalk["default"].green('库构建完成'));

      if (typeof callback == 'function') {
        callback();
      }
    });
  });
};

exports.getSsrLib = getSsrLib;

var injectHtmlToRootNode = function injectHtmlToRootNode(htmlFilePath) {
  var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var rootSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#root';

  if (_fs["default"].existsSync(htmlFilePath)) {
    try {
      var ohtml = _fs["default"].readFileSync(htmlFilePath, {
        encoding: 'utf-8'
      });

      var $ = _cheerio["default"].load(ohtml);

      $(rootSelector).html(html);

      _fs["default"].writeFileSync(htmlFilePath, $.html());
    } catch (ex) {
      console.error(ex);
      (0, _process.exit)(1);
    }
  } else {
    console.error(htmlFilePath + ' not exist');
  }
};

exports.injectHtmlToRootNode = injectHtmlToRootNode;