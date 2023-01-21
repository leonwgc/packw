import { getWebpackConfig } from './pack';
import chalk from 'chalk';
import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import merge from 'webpack-merge';

const getProjectPath = (dir = './') => {
  return path.join(process.cwd(), dir);
};

/**
 * build lib for ssr
 * @param entry
 * @param output
 * @param callback
 */
export const getSsrLib = (entry, output = './ssr-lib', callback?: () => void) => {
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
      console.log(chalk.green('successfully finished!'));
      callback?.();
    });
  });
};
