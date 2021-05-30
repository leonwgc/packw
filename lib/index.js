"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _commander = require("commander");

var _pack = require("./pack");

var _package = _interopRequireDefault(require("../package.json"));

var program = new _commander.Command('packx');
program.name('packx').usage('[options] start/build/run');
program.version(_package["default"].version, '-v, --version');
program.command('start [dir]').description('启动开发').option('-p, --port [port]', '端口号', 9000).action(function () {
  var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'index';
  var options = arguments.length > 1 ? arguments[1] : undefined;
  (0, _pack.run)(dir, '/', true, options.port);
});
program.command('build [dir]').description('启动构建').option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/').action(function () {
  var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'index';
  var options = arguments.length > 1 ? arguments[1] : undefined;
  (0, _pack.run)(dir, options.publicPath, false);
});
program.command('run').description('配置packx.config.js开发/构建').option('--build [build]', '启动构建').action(function (options) {
  (0, _pack.pack)(!options.build);
});
program.parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}