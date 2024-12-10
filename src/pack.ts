/* eslint-disable no-console */

import path from 'path';
import fs from 'fs';
import process from 'process';
import chalk from 'chalk';
import glob from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WebpackBar from 'webpackbar';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack, { Configuration, RuleSetRule } from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ip } from 'address';
import tpl from './tpl';
export { getNodeLib, injectHtml, getProjectPath } from './nodeLib';
export { encryptKey, decryptSignedKey, default as uploadAliOss } from './uploadAliOss';

const defaultDevPort = 9000;

const getProjectPath = (dir = './') => {
  return path.join(process.cwd(), dir);
};

function exit(error) {
  console.log(chalk.red(error));
  process.exit(9);
}

type CssHandleType = 'less' | 'sass' | 'css' | 'custom';

type CssHandleCustFun = () => RuleSetRule | RuleSetRule[] | null;

/**
 * Get style loaders use setting
 * @param type
 * @param dev
 * @param custFun
 * @returns
 */
export const getStyleLoaderUse = (
  type: CssHandleType = 'less',
  dev: boolean,
  custFun?: CssHandleCustFun
) => {
  let rules: RuleSetRule[] = [
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap: dev,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          plugins: [
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
          sourceMap: dev,
        },
      },
    },
  ];

  switch (type) {
    case 'less': {
      rules.push({
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            relativeUrls: false,
            javascriptEnabled: true,
          },
          sourceMap: dev,
        },
      });
      break;
    }
    case 'sass': {
      rules.push({
        loader: require.resolve('sass-loader'),
        options: {
          sourceMap: dev,
        },
      });
      break;
    }
    case 'custom': {
      if (typeof custFun === 'function') {
        const rule = custFun();
        if (rule) {
          rules = rules.concat(rule);
        }
      }
      break;
    }
  }

  if (dev) {
    rules.unshift({ loader: require.resolve('style-loader') });
  } else {
    rules.unshift({
      loader: MiniCssExtractPlugin.loader,
    });
  }

  return rules;
};

/**
 * Babel config
 * @param dev
 * @returns
 */
const getBabelConfig = (dev: boolean) => {
  const plugins = [
    [require.resolve('@babel/plugin-transform-runtime')],
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: false }],
  ];

  if (dev) {
    plugins.push([require.resolve('react-refresh/babel')]);
  }
  return {
    cacheDirectory: true,
    presets: [
      [
        //include the transformations and polyfills for the features that we use and that are missing in our target browsers.
        require.resolve('@babel/preset-env'),
        {
          modules: 'auto', // Setting this to false will preserve ES modules. Use this only if you intend to ship native ES Modules to browsers. If you are using a bundler with Babel, the default modules: "auto" is always preferred.
        },
      ],
      [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: plugins,
  };
};

/**
 * Get static asset config
 * @param type
 * @returns
 */
const getAssetConfig = (type: string) => {
  return {
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: `${type}/[name].[hash:8][ext]`,
    },
  };
};

/**
 * Get html-webpack-plugins config and prepare the html template
 * @param dirs
 * @param isDev
 * @returns
 */
const getHtmlPluginsConfig = (dirs: string[] = [], isDev: boolean) => {
  // Check & emit index.html in project root
  let hasTempalteFunc = fs.existsSync(getProjectPath('./index.tpl.js'));
  if (!hasTempalteFunc && !fs.existsSync(getProjectPath('./index.html'))) {
    fs.writeFileSync(getProjectPath('./index.html'), tpl);
  }

  const htmlPlugins = [];

  for (let dir of dirs) {
    htmlPlugins.push(
      new HtmlWebpackPlugin(
        Object.assign(
          {
            filename: `${dir}.html`,
            [hasTempalteFunc && !isDev ? 'templateContent' : 'template']:
              hasTempalteFunc && !isDev
                ? ({ htmlWebpackPlugin }) =>
                    require(getProjectPath('./index.tpl.js'))(htmlWebpackPlugin)
                : getProjectPath('index.html'),
            chunks: [dir, 'vendor', 'common', 'runtime'],
          },
          !isDev
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      )
    );
  }

  return htmlPlugins;
};

/**
 * Get a webpack configuration
 * @param dev
 * @param entry
 * @param publicPath
 * @param target
 * @param banner
 * @returns
 */
export const getWebpackConfig = (
  dev = true,
  entry: Record<string, string> = {},
  publicPath = '/',
  target: 'node' | 'web' = 'web',
  banner?: string
): Configuration => {
  const entryKeys = Object.keys(entry);
  const isNodeTarget = target === 'node';
  const htmlPlugins = isNodeTarget ? [] : getHtmlPluginsConfig(entryKeys, dev);
  const name = entryKeys.join('-');

  const styleLoaders = !isNodeTarget
    ? [
        {
          test: /\.less$/,
          use: getStyleLoaderUse('less', dev),
        },
        {
          test: /\.s[ac]ss$/i,
          use: getStyleLoaderUse('sass', dev),
        },
        {
          test: /\.css$/,
          use: getStyleLoaderUse('css', dev),
        },
      ]
    : [
        {
          test: /\.(less|sass|scss|css)$/,
          use: require.resolve('./ignore'),
        },
      ];

  const plugins: Array<unknown> = [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __dev__: dev,
    }),
  ];

  if (typeof banner === 'string' && banner.trim()) {
    plugins.push(new WebpackBar({ name: banner }));
  }

  if (!isNodeTarget) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash:6].css`,
        chunkFilename: `[name].[contenthash:6].css`,
      })
    );
    plugins.push(...htmlPlugins);
  }

  const config = {
    mode: dev ? 'development' : 'production',
    bail: !dev,
    entry,
    output: {
      path: getProjectPath('./dist'),
      chunkFilename: `[name].[contenthash:6].js`,
      filename: dev ? '[name].js' : `[name].[contenthash:6].js`,
      publicPath,
    },
    devtool: dev ? 'cheap-module-source-map' : false,
    target,
    cache: isNodeTarget
      ? false
      : dev
      ? {
          type: 'filesystem',
          name,
          buildDependencies: {
            config: [__filename],
          },
          store: 'pack',
        }
      : {
          type: 'filesystem',
          name: name + '-prd',
          buildDependencies: {
            config: [__filename],
          },
          store: 'pack',
        },
    module: {
      rules: [
        {
          test: /\.[j|t]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: getBabelConfig(dev),
          },
        },

        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          ...getAssetConfig('images'),
        },
        {
          test: /\.(ttf|otf|woff|woff2|eot)$/,
          ...getAssetConfig('fonts'),
        },
        ...styleLoaders,
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '~': getProjectPath('./src'),
        '@': getProjectPath('./src'),
      },
    },
    optimization: {
      splitChunks: {
        name: false,
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      },
      runtimeChunk: isNodeTarget
        ? false
        : {
            name: 'runtime',
          },
      moduleIds: dev ? 'named' : 'deterministic',
      chunkIds: dev ? 'named' : 'deterministic',
    },
    stats: 'errors-warnings',
    plugins,
  };

  if (dev) {
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        overlay: false,
      })
    );
  } else {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [new CssMinimizerPlugin(), '...'],
    } as any;
  }

  return config as Configuration;
};

/**
 * Run webpack on configuration
 * @param config
 * @param openFile default index, open index.html by default.
 * @param dev boolean, whether run in dev mode
 * @param devPort
 * @param devServerConfig
 * @param callback
 */
const runWebpack = (
  config: Configuration,
  openFile = 'index',
  dev: boolean,
  devPort?: number,
  devServerConfig?: WebpackDevServer.Configuration,
  callback?: () => void
) => {
  if (dev) {
    const compiler = webpack(config);
    const serverConfig: WebpackDevServer.Configuration = {
      compress: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      hot: true,
      inline: true,
      noInfo: true,
      ...devServerConfig,
    };
    const port = serverConfig.port || devPort;
    // dont upgrade dev server to 5.x.
    const devServer = new WebpackDevServer(compiler, serverConfig);

    devServer.listen(port, serverConfig.host, (err) => {
      if (err) {
        exit(err);
      }
      const page = `${openFile === 'index' ? '' : openFile + '.html'}`;
      const serveUrl = `http://localhost:${port}/${page}`;
      const serverUrlIp = `http://${ip()}:${port}/${page}`;

      console.log(chalk.cyan('dev server is listening at'));
      console.log();
      console.log('> Local:', chalk.green(`${serveUrl}`));
      console.log();
      console.log('> Network:', chalk.green(`${serverUrlIp}`));
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        if (devServer) {
          devServer.close();
        }
        process.exit();
      });
    });
  } else {
    const compiler = webpack(config);

    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(stats);
      }

      compiler.close(() => {
        console.log(chalk.green('done 🍺 '));
        callback?.();
      });
    });
  }
};

/**
 * SPA build, used for cli build
 * @param dir
 * @param publicPath
 * @param dev
 * @param port
 */
export const run = (dir = 'index', publicPath = '/', dev = true, port = defaultDevPort) => {
  let s = glob.sync(`./src/${dir}/index{.jsx,.js,.ts,.tsx}`);
  let isDir = true;
  if (!s.length) {
    s = glob.sync(`./src/index{.jsx,.js,.ts,.tsx}`);
    if (!s.length) {
      exit(`Entry not found : ${getProjectPath('./src/index')}`);
    }
    isDir = false;
  }
  const entryFile = s[0];

  const config = getWebpackConfig(dev, { [dir]: entryFile }, publicPath);

  runWebpack(config, isDir ? dir : 'index', dev, port);
};

/**
 * Node build
 *
 * @export
 * @param {boolean} dev whether run in dev mode
 * @param {Configuration} config Webpack configuration
 * @param {() => void} callback callback after production build finished.
 * @param {string} banner banner text
 */
export default function pack(
  dev: boolean,
  config: Configuration,
  callback?: () => void,
  banner?: string
) {
  const { entry, devServer = {}, ...others } = config;

  if (typeof entry === 'object' && entry && Object.keys(entry).length) {
    const keys = Object.keys(entry);
    const config = getWebpackConfig(dev, entry as Record<string, string>, '/', 'web', banner);
    const finalConfig = merge({}, config, others);
    return runWebpack(finalConfig, keys[0], dev, defaultDevPort, devServer, callback);
  } else {
    exit('Entry not found');
  }
}
