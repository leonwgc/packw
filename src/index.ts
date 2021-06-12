import { Command } from 'commander';
import { run, pack } from './pack';

const program = new Command('packx');

program.name('packx').usage('[options] start/build/run');
program.version(require('../package').version, '-v, --version');

program
  .command('start [dir]')
  .description('启动开发')
  .option('-p, --port [port]', '端口号', 9000)
  .action((dir = 'index', options) => {
    run(dir, '/', true, options.port);
  });

program
  .command('build [dir]')
  .description('启动构建')
  .option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/')
  .action((dir = 'index', options) => {
    run(dir, options.publicPath, false);
  });

program
  .command('run')
  .description('配置packx.config.js开发/构建')
  .option('--build [build]', '启动构建')
  .action((options) => {
    pack(!options.build);
  });

program.parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
