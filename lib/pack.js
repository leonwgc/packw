/* eslint-disable no-console */

//#region require
const process = require('process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');

//#endregion

//#region  helper
const getProjectPath = (dir = './') => {
  return path.join(process.cwd(), dir);
};

const getToolPath = (dir = './') => {
  return path.join(__dirname, dir);
};

function exit(error) {
  console.log(chalk.red(error));
  process.exit(9);
}

//#endregion

//#endregion

//#region style process
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

//#endregion

//#region  babel config
const getBabelOptions = (isDev) => {
  const plugins = [
    [require.resolve('@babel/plugin-transform-runtime')],
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: false }],
    [require.resolve('@babel/plugin-proposal-optional-chaining')],
  ];

  if (isDev) {
    plugins.push([require.resolve('react-refresh/babel')]);
  }
  return {
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
  };
};

//#endregion

//#region static asset
const getAssetConfig = (type) => {
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

//#endregion

//#region html webpack
const getHtmlPluginsConfig = (dirs = [], isDev) => {
  const htmlsPlugins = [];

  for (dir of dirs) {
    htmlsPlugins.push(
      new HtmlWebpackPlugin(
        Object.assign(
          {
            filename: `${dir}.html`,
            template: getProjectPath('index.html'),
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

  return htmlsPlugins;
};

//#endregion

//#region  config
const getConfig = (isDev = true, entry, publicPath = '/') => {
  const htmlsPlugins = getHtmlPluginsConfig(Object.keys(entry), isDev);

  const config = {
    mode: isDev ? 'development' : 'production',
    bail: !isDev,
    entry,
    output: {
      path: getProjectPath('./dist'),
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
            options: getBabelOptions(isDev),
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
          use: getStyleLoaders('css', isDev),
        },
        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          ...getAssetConfig('images'),
        },
        {
          test: /\.(ttf|otf|woff|woff2|eot)$/,
          ...getAssetConfig('fonts'),
        },
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
      runtimeChunk: {
        name: 'runtime',
      },
      moduleIds: isDev ? 'named' : 'deterministic',
      chunkIds: isDev ? 'named' : 'deterministic',
    },
    stats: 'errors-warnings',
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash:6].css`,
        chunkFilename: `[name].[contenthash:6].css`,
      }),
      new webpack.DefinePlugin({
        __dev__: isDev,
      }),
      new WebpackBar({ name: 'packx' }),
      ...htmlsPlugins,
    ],
  };

  if (isDev) {
    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        overlay: true,
      })
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

//#endregion

//#region run
const runWebpack = (config, openFile = 'index', isDev, port) => {
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
      const serveUrl = `http://localhost:${port}/${openFile}.html`;
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
};
//#endregion

//#region spa mode
exports.run = (dir = 'index', publicPath = '/', isDev = true, port = 9000) => {
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

  // index.html tpl check & emit
  if (!fs.existsSync(getProjectPath('./index.html'))) {
    const tpl = fs.readFileSync(getToolPath('./index.ejs'), {
      encoding: 'utf-8',
    });
    fs.writeFileSync(getProjectPath('./index.html'), tpl);
  }

  const config = getConfig(isDev, { [dir]: entryFile }, publicPath);

  runWebpack(config, isDir ? dir : 'index', isDev, port);
};

//#endregion

//#region mpa mode

exports.pack = (isDev = true, port = 9000, publicPath = '/') => {
  const configFile = getProjectPath('./packx.config.js');
  if (!fs.existsSync(configFile)) {
    exit(`入口配置文件不存在:packx.config.js`);
  }

  const custConfig = require(configFile);
  const { entry, ...others } = custConfig;
  if (typeof entry === 'object' && entry) {
    const keys = Object.keys(entry);
    if (keys.length) {
      const { merge } = require('webpack-merge');
      const config = getConfig(isDev, entry, publicPath);
      const mergedConfig = merge(config, others);
      return runWebpack(mergedConfig, keys[0], isDev, port);
    }
  }
  exit('1');
};

//#endregion
