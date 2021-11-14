import { Command } from 'commander';
import { run } from './pack';

const program = new Command('packx');

program.name('packx').usage('[options] start/build/run');
program.version(require('../package').version, '-v, --version');

program
  .command('start')
  .description('开发')
  .option('-p, --port [port]', '端口号', '9000')
  .action((options) => {
    run('index', '/', true, options.port);
  });

program
  .command('build')
  .description('构建')
  .option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/')
  .action((options) => {
    run('index', options.publicPath, false);
  });

program.parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
