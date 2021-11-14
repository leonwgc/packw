"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectHtmlToRootNode = exports.getSsrLib = void 0;

var pack_1 = require("./pack");

var chalk_1 = __importDefault(require("chalk"));

var path_1 = __importDefault(require("path"));

var fs_1 = __importDefault(require("fs"));

var webpack_1 = __importDefault(require("webpack"));

var webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));

var cheerio_1 = __importDefault(require("cheerio"));

var webpack_merge_1 = __importDefault(require("webpack-merge"));

var process_1 = require("process");

var getProjectPath = function getProjectPath(dir) {
  if (dir === void 0) {
    dir = './';
  }

  return path_1.default.join(process.cwd(), dir);
};
/**
 *  编译commonjs库,用于node端渲染html
 *
 * @param {*} entry
 * @param {() => void} [callback]
 */


var getSsrLib = function getSsrLib(entry, callback) {
  var config = (0, pack_1.getConfig)(false, entry, '', 'node');
  var ssrConfig = {
    entry: entry,
    externals: [(0, webpack_node_externals_1.default)()],
    output: {
      path: getProjectPath('./ssr-lib'),
      filename: '[name].js',
      library: {
        type: 'commonjs2'
      }
    }
  };
  var mergeConfig = (0, webpack_merge_1.default)({}, config, ssrConfig);
  var compiler = (0, webpack_1.default)(mergeConfig);
  compiler.run(function (err, stats) {
    if (err || stats.hasErrors()) {
      console.log(err.stack || err.message || err);
    }

    compiler.close(function () {
      console.log(chalk_1.default.green('库构建完成'));
      callback === null || callback === void 0 ? void 0 : callback();
    });
  });
};

exports.getSsrLib = getSsrLib;
/**
 *
 *
 * @param {string} htmlFilePath 文件路径
 * @param {string} [html=''] 注入的html
 * @param {string} [rootSelector='#root'] 注入到的html element 元素, 比如ReactDOM render的root container
 */

var injectHtmlToRootNode = function injectHtmlToRootNode(htmlFilePath, html, rootSelector) {
  if (html === void 0) {
    html = '';
  }

  if (rootSelector === void 0) {
    rootSelector = '#root';
  }

  if (fs_1.default.existsSync(htmlFilePath)) {
    try {
      var ohtml = fs_1.default.readFileSync(htmlFilePath, {
        encoding: 'utf-8'
      });
      var $ = cheerio_1.default.load(ohtml);
      $(rootSelector).html(html);
      fs_1.default.writeFileSync(htmlFilePath, $.html());
    } catch (ex) {
      console.error(ex);
      (0, process_1.exit)(1);
    }
  } else {
    console.error(htmlFilePath + ' not exist');
  }
};

exports.injectHtmlToRootNode = injectHtmlToRootNode;