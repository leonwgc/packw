import { getWebpackConfig } from './pack';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import process from 'process';
import nodeExternals from 'webpack-node-externals';
import cheerio from 'cheerio';
import merge from 'webpack-merge';
import { exit } from 'process';

const getProjectPath = (dir = './') => {
  return path.join(process.cwd(), dir);
};

/**
 * Build commonjs for node rendering.
 * @param entry webpack entry
 * @param output output folder , default ./ssr-lib
 * @param callback after build , callback will be invoked.
 */
export const getNodeLib = (
  entry: Record<string, string>,
  output?: string,
  callback?: () => void
) => {
  // no output setting
  if (typeof output === 'function') {
    callback = output;
    output = './ssr-lib';
  }
  const config = getWebpackConfig(false, entry, '', 'node');

  const ssrConfig = {
    entry,
    externals: [nodeExternals()],
    output: {
      path: getProjectPath(output),
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
      console.log(chalk.green('successfully build!'));
      callback?.();
    });
  });
};

/**
 * Inject html to html root node for hydration.
 * @param {string} htmlFile HTML file path
 * @param {string} [htmlContent=''] HTML content that will be injected.
 * @param {string} [rootSelector='#root'] Hydration root html element selector, default #root
 */
export const injectHtml = (htmlFile: string, htmlContent: string = '', rootSelector = '#root') => {
  if (fs.existsSync(htmlFile)) {
    try {
      const ohtml = fs.readFileSync(htmlFile, { encoding: 'utf-8' });
      const $ = cheerio.load(ohtml);
      $(rootSelector).html(htmlContent);
      fs.writeFileSync(htmlFile, $.html());
    } catch (ex) {
      console.error(ex);
      exit(1);
    }
  } else {
    console.error(htmlFile + 'does not exist');
  }
};
