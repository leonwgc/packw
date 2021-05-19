const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackBar = require('webpackbar');
const fs = require('fs');
const path = require('path');
const helper = require('./helper');

const getEntry = (isDev, dir, resolvedEntey) => {
  const entry = Object.create(null);

  entry[dir] = [helper.getToolPath('./polyfill'), resolvedEntey];

  htmlsPlugins.push(
    new HtmlWebpackPlugin(
      Object.assign(
        {
          filename: `${dir}.html`,
          templateContent: ({ htmlWebpackPlugin }) =>
            getHtmlTpl(
              isUsingFlexH5,
              htmlWebpackPlugin,
              configObject[dir].title,
              env,
            ),
          inject: false,
          hash: false,
          chunks: [dir, 'vendor', 'common', 'runtime'],
        },
        isProd
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
};

const getStyleLoaders = (isDev, useCss = false) => {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDev,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          sourceMap: isDev,
        },
      },
    },
    {
      loader: 'less-loader',
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
    loaders.unshift({ loader: 'style-loader' });
  }
  return loaders;
};

module.exports = (isDev = true) => {
  const config = {
    mode: isDev ? 'development' : 'production',
    bail: !isDev,
    entry,
    output: {
      path: getDist(),
      chunkFilename: `[name].[contenthash:6].js`,
      filename: isDev ? '[name].js' : `[name].[contenthash:6].js`,
      publicPath: isDev ? '' : getPublicPath(),
    },
    devtool: isDev ? 'cheap-module-source-map' : false,
    target: 'web',
    module: {
      rules: [
        {
          test: /\.[j|t]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
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
            loader: 'url-loader',
            options: {
              limit: isProd ? 10000 : 1,
              name: helper.getProjectPath(
                './images/[name].[contenthash:6].[ext]',
              ),
            },
          },
        },
        {
          test: /\.(ttf|otf|woff|woff2|eot)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: helper.getProjectPath('./fonts/[name].[ext]'),
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
      new WebpackBar({ name: `编译模块:${dir}` }),
      ...htmlsPlugins,
    ],
  };
};
