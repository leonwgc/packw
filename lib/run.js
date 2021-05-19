/* eslint-disable no-console */
const process = require('process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const open = require('open');

const helper = require('./helper');

const getEntry = (dir, resolvedEntey) => {
  const entry = Object.create(null);
  entry[dir] = [resolvedEntey];
  return entry;
};

const resolveLoader = (loader) => {
  return require.resolve(loader);
};

const getStyleLoaders = (isDev, useCss = false) => {
  const loaders = [
    {
      loader: resolveLoader('css-loader'),
      options: {
        sourceMap: isDev,
      },
    },
    {
      loader: resolveLoader('postcss-loader'),
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
          sourceMap: isDev,
        },
      },
    },
    {
      loader: resolveLoader('less-loader'),
      options: {
        relativeUrls: false,
        sourceMap: isDev,
        javascriptEnabled: true,
      },
    },
  ];

  if (useCss) {
    loaders.pop();
  }

  loaders.unshift({
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDev,
      reloadAll: true,
    },
  });
  if (isDev) {
    loaders.shift();
    loaders.unshift({ loader: resolveLoader('style-loader') });
  }
  return loaders;
};

const getConfig = (isDev = true, entry, htmlsPlugins = []) => {
  const plugins = [
    [require.resolve('@babel/plugin-transform-runtime')],
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: false },
    ],
    [require.resolve('@babel/plugin-proposal-optional-chaining')],
  ];

  if (isDev) {
    plugins.push([require.resolve('react-refresh/babel')]);
  }
  const config = {
    mode: isDev ? 'development' : 'production',
    bail: !isDev,
    entry,
    output: {
      path: helper.getProjectPath('./dist'),
      chunkFilename: `[name].[contenthash:6].js`,
      filename: isDev ? '[name].js' : `[name].[contenthash:6].js`,
      publicPath: isDev ? '/' : '/', // TODO: publicpath
    },
    devtool: isDev ? 'cheap-module-source-map' : false,
    target: 'web',
    module: {
      rules: [
        {
          test: /\.[j|t]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: resolveLoader('babel-loader'),
            options: {
              cacheDirectory: true,
              presets: [
                [
                  require.resolve('@babel/preset-env'),
                  {
                    modules: false,
                  },
                ],
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript'),
              ],
              plugins: plugins,
            },
          },
        },
        {
          test: /\.less$/,
          use: getStyleLoaders(isDev),
        },
        {
          test: /\.css$/,
          use: getStyleLoaders(isDev, true),
        },
        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          use: {
            loader: resolveLoader('url-loader'),
            options: {
              limit: !isDev ? 10000 : 1,
              name: './images/[name].[contenthash:6].[ext]',
            },
          },
        },
        {
          test: /\.(ttf|otf|woff|woff2|eot)$/,
          use: {
            loader: resolveLoader('url-loader'),
            options: {
              name: './fonts/[name].[ext]',
              limit: 8192,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '~': helper.getProjectPath('./src'),
        '@': helper.getProjectPath('./src'),
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
      runtimeChunk: {
        name: 'runtime',
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash:6].css`,
        chunkFilename: `[name].[contenthash:6].css`,
      }),
      new webpack.DefinePlugin({
        __client__: true,
        __dev__: isDev,
      }),
      new webpack.HashedModuleIdsPlugin({
        hashDigestLength: 20,
      }),
      new WebpackBar(),
      ...htmlsPlugins,
    ],
    stats: 'errors-warnings',
  };

  if (isDev) {
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    );
  } else {
    config.plugins.push(
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          safe: true,
          // 关闭autoprefixer功能
          // 使用postcss的autoprefixer功能
          autoprefixer: false,
        },
      }),
    );
  }

  return config;
};

// dir 1. ./src/dir  2. ./src/index.
module.exports = (dir = 'index', port = 9000, isDev = true) => {
  let s = glob.sync(`./src/${dir}/index{.jsx,.js,.ts,.tsx}`);
  let isDir = true;
  if (!s.length) {
    s = glob.sync(`./src/index{.jsx,.js,.ts,.tsx}`);
    if (!s.length) {
      exit(`can't find entry file`);
    }
    isDir = false;
  }
  const entryFile = s[0];
  let distFile = `${isDir ? dir : 'index'}.html`;

  // index.html tpl check & emit
  if (!fs.existsSync(helper.getProjectPath('./index.html'))) {
    const tpl = fs.readFileSync(helper.getToolPath('./index.ejs'), {
      encoding: 'utf-8',
    });
    fs.writeFileSync(helper.getProjectPath('./index.html'), tpl);
  }

  const htmlsPlugins = [];

  htmlsPlugins.push(
    new HtmlWebpackPlugin(
      Object.assign(
        {
          filename: distFile,
          template: helper.getProjectPath('index.html'),
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
          : undefined,
      ),
    ),
  );

  const entry = getEntry(dir, entryFile);
  const config = getConfig(isDev, entry, htmlsPlugins);

  let devServer;
  if (isDev) {
    const compiler = webpack(config);
    const serverConfig = {
      publicPath: '/',
      compress: true,
      disableHostCheck: true,
      hot: true,
      inline: true,
      noInfo: true,
    };
    devServer = new WebpackDevServer(compiler, serverConfig);
    devServer.listen(port, '0.0.0.0', async (err) => {
      if (err) {
        return console.error(err);
      }
      const serveUrl = `http://localhost:${port}/${isDir ? dir : 'index'}.html`;
      // await open(serveUrl);
      console.log(chalk.green(`dev server: ${serveUrl}`));
    });
  } else {
    webpack(config, (err, stats) => {
      // Stats Object
      if (err || stats.hasErrors()) {
        // Handle errors here
      }
      console.log(chalk.green('done'));
    });
  }

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      if (devServer) {
        devServer.close();
      }
      process.exit();
    });
  });

  function exit(error) {
    console.log(chalk.red(error));
    process.exit(9);
  }
};
