"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var commander_1 = require("commander");

var pack_1 = require("./pack"); // import pkg from '../package.json';


var program = new commander_1.Command('packx');
program.name('packx').usage('[options] start/build/run'); // program.version(pkg.version as string, '-v, --version');

program.command('start [dir]').description('启动开发').option('-p, --port [port]', '端口号', 9000).action(function (dir, options) {
  if (dir === void 0) {
    dir = 'index';
  }

  pack_1.run(dir, '/', true, options.port);
});
program.command('build [dir]').description('启动构建').option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/').action(function (dir, options) {
  if (dir === void 0) {
    dir = 'index';
  }

  pack_1.run(dir, options.publicPath, false);
});
program.command('run').description('配置packx.config.js开发/构建').option('--build [build]', '启动构建').action(function (options) {
  pack_1.pack(!options.build);
});
program.parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}