import { Command } from 'commander';
import { run, pack } from './pack';

const program = new Command();

program
  .command('start <dir>')
  .description('打包src目录下的入口目录/文件')
  .option('-p, --port [port]', '端口号', 9000)
  .action((dir, options) => {
    run(dir, '/', true, options.port);
  });

program
  .command('build <dir>')
  .description('构建src目录下的入口目录/文件')
  .option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/')
  .action((dir, options) => {
    run(dir, options.publicPath, false);
  });

program
  .command('run')
  .description('自定义packx.config.js开发，构建，mpa打包')
  .option('--build [build]', 'build模式')
  .action((options) => {
    pack(!options.build);
  });

program.parse(process.argv);

if (!program.args[0]) {
  program.help();
}
