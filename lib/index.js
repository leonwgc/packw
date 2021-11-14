"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var commander_1 = require("commander");

var pack_1 = require("./pack");

var program = new commander_1.Command('packx');
program.name('packx').usage('[options] start/build/run');
program.version(require('../package').version, '-v, --version');
program.command('start').description('开发').option('-p, --port [port]', '端口号', 9000).action(function (options) {
  (0, pack_1.run)('index', '/', true, options.port);
});
program.command('build').description('构建').option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/').action(function (options) {
  (0, pack_1.run)('index', options.publicPath, false);
});
program.parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}