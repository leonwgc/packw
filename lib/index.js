const { Command } = require('commander');
const run = require('./run');

const program = new Command();

program
  .command('start <dir>')
  .description('打包src目录下的入口目录/文件')
  .option('-p, --port', '端口号', 9000)
  .action((dir, options) => {
    run(dir, options.port, true);
  });

program
  .command('build <dir>')
  .description('构建src目录下的入口目录/文件')
  .option('-p, --public-path [publicPath]', '设置publicPath, 默认 /', '/')
  .action((dir, options) => {
    run(dir, options.publicPath, false);
  });

program.parse(process.argv);

if (!program.args[0]) {
  program.help();
}
