import { getConfig } from './pack';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import cheerio from 'cheerio';
import merge from 'webpack-merge';
import { exit } from 'process';

const getProjectPath = (dir = './') => {
  return path.join(process.cwd(), dir);
};

// get a ssr commonjs2 lib to render html string
export const getSsrLib = (entry, callback?: () => void) => {
  const config = getConfig(false, entry, '', 'node');

  const ssrConfig = {
    entry,
    externals: [nodeExternals()],
    output: {
      path: getProjectPath('./ssr-lib'),
      filename: '[name].js',
      library: {
        type: 'commonjs2',
      },
    },
  };

  const mergeConfig = merge({}, config, ssrConfig);

  const compiler = webpack(mergeConfig);

  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err.stack || err.message || err);
    }

    compiler.close(() => {
      console.log(chalk.green('库构建完成'));
      if (typeof callback == 'function') {
        callback();
      }
    });
  });
};

export const injectHtmlToRootNode = (
  htmlFilePath: string,
  html: string = '',
  rootSelector = '#root'
) => {
  if (fs.existsSync(htmlFilePath)) {
    try {
      const ohtml = fs.readFileSync(htmlFilePath, { encoding: 'utf-8' });
      const $ = cheerio.load(ohtml);
      $(rootSelector).html(html);
      fs.writeFileSync(htmlFilePath, $.html());
    } catch (ex) {
      console.error(ex);
      exit(1);
    }
  } else {
    console.error(htmlFilePath + ' not exist');
  }
};
