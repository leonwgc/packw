/* eslint-disable no-console */
const process = require('process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');

const helper = require('./helper');

const getEntry = (dir, resolvedEntey) => {
  const entry = Object.create(null);
  entry[dir] = [resolvedEntey];
  return entry;
};

// type: less, sass, css
const getStyleLoaders = (type = 'less', isDev) => {
  const loaders = [
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap: isDev,
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
          sourceMap: isDev,
        },
      },
    },
  ];

  switch (type) {
    case 'less': {
      loaders.push({
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            relativeUrls: false,
            javascriptEnabled: true,
          },
          sourceMap: isDev,
        },
      });
      break;
    }
    case 'sass': {
      loaders.push({
        loader: require.resolve('sass-loader'),
        options: {
          implementation: require('sass'),
          sourceMap: isDev,
        },
      });
      break;
    }
  }

  if (isDev) {
    loaders.unshift({ loader: require.resolve('style-loader') });
  } else {
    loaders.unshift({
      loader: MiniCssExtractPlugin.loader,
    });
  }

  return loaders;
};

const getConfig = (
  dir,
  isDev = true,
  entry,
  htmlsPlugins = [],
  publicPath = '/',
) => {
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
      publicPath,
    },
    devtool: isDev ? 'cheap-module-source-map' : false,
    target: 'web',
    cache: isDev
      ? {
          type: 'filesystem',
          name: dir,
          buildDependencies: {
            config: [__filename],
          },
          store: 'pack',
        }
      : false,
    module: {
      rules: [
        {
          test: /\.[j|t]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
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
          use: getStyleLoaders('less', isDev),
        },
        {
          test: /\.s[ac]ss$/i,
          use: getStyleLoaders('sass', isDev),
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: getStyleLoaders('css', isDev),
        },
        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
          generator: {
            filename: 'images/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(ttf|otf|woff|woff2|eot)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb
            },
          },
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
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
      moduleIds: isDev ? 'named' : 'deterministic',
      chunkIds: isDev ? 'named' : 'deterministic',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash:6].css`,
        chunkFilename: `[name].[contenthash:6].css`,
      }),
      new webpack.DefinePlugin({
        __dev__: isDev,
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
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [new CssMinimizerPlugin()],
    };
  }

  return config;
};

// dir 1. ./src/dir  2. ./src/index.
module.exports = (
  dir = 'index',
  publicPath = '/',
  isDev = true,
  port = 9000,
) => {
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
  const config = getConfig(dir, isDev, entry, htmlsPlugins, publicPath);

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
      console.log(chalk.green(`dev server: ${serveUrl}`));
    });
  } else {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(stats);
      }

      compiler.close(() => {
        console.log(chalk.green('构建完成'));
      });
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
