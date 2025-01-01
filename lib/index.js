var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "packw",
      version: "2.4.0",
      description: "Webpack5 out-of-the-box dx for react project.",
      bin: {
        packw: "./bin/cli.js"
      },
      main: "./lib/pack.js",
      typings: "./types/pack.d.ts",
      scripts: {
        dev: "father-build -w",
        build: "father-build && tsc",
        "build-new": "tsup && tsc"
      },
      tags: [
        "react",
        "webpack",
        "webpack5",
        "webpack-cli tool"
      ],
      keywords: [
        "react",
        "webpack",
        "webpack-cli tool"
      ],
      author: "leonwgc",
      license: "MIT",
      dependencies: {
        "@babel/cli": "^7.25.9",
        "@babel/core": "^7.26.0",
        "@babel/eslint-parser": "^7.25.9",
        "@babel/plugin-proposal-class-properties": "^7.0.0",
        "@babel/plugin-proposal-decorators": "^7.17.2",
        "@babel/plugin-syntax-dynamic-import": "^7.0.0",
        "@babel/plugin-syntax-import-meta": "^7.0.0",
        "@babel/plugin-transform-nullish-coalescing-operator": "^7.18.6",
        "@babel/plugin-transform-optional-chaining": "^7.16.7",
        "@babel/plugin-transform-runtime": "^7.25.9",
        "@babel/preset-env": "^7.26.0",
        "@babel/preset-react": "^7.25.9",
        "@babel/preset-typescript": "^7.26.0",
        "@babel/runtime": "^7.26.0",
        "@babel/runtime-corejs3": "^7.26.0",
        "@pmmmwh/react-refresh-webpack-plugin": "^0.5.15",
        address: "^2.0.3",
        "ali-oss": "^6.22.0",
        autoprefixer: "^10.4.20",
        "babel-loader": "^9.2.1",
        "babel-plugin-import": "^1.13.8",
        "babel-plugin-lodash": "^3.3.4",
        chalk: "^4.1.2",
        cheerio: "^1.0.0-rc.12",
        "clean-webpack-plugin": "^4.0.0",
        commander: "^8.3.0",
        "core-js": "^3.39.0",
        "css-loader": "^7.1.2",
        "css-minimizer-webpack-plugin": "^7.0.0",
        draftlog: "^1.0.13",
        ejs: "^3.1.10",
        "fs-extra": "^11.2.0",
        glob: "^11.0.0",
        "html-webpack-plugin": "^5.6.3",
        "import-local": "^3.2.0",
        less: "^3.13.1",
        "less-loader": "^10.2.0",
        "mini-css-extract-plugin": "^2.9.2",
        postcss: "^8.4.49",
        "postcss-flexbugs-fixes": "^5.0.2",
        "postcss-loader": "^8.1.1",
        "postcss-preset-env": "^10.1.1",
        "react-refresh": "^0.14.2",
        sass: "^1.82.0",
        "sass-loader": "^12.6.0",
        "style-loader": "^4.0.0",
        typescript: "^5.7.2",
        webpack: "^5.97.0",
        "webpack-dev-server": "^3.11.3",
        "webpack-merge": "^5.10.0",
        "webpack-node-externals": "^3.0.0",
        webpackbar: "^7.0.0",
        yargs: "^17.7.2"
      },
      devDependencies: {
        "@types/glob": "^7.2.0",
        "@types/node": "^16.18.96",
        "@types/webpack-dev-server": "^3.11.6",
        "babel-preset-minify": "^0.5.2",
        "father-build": "^1.22.5",
        tsup: "^8.3.5"
      },
      files: [
        "lib",
        "bin",
        "types"
      ]
    };
  }
});

// src/index.ts
var import_commander = require("commander");

// src/pack.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_process = __toESM(require("process"));
var import_chalk3 = __toESM(require("chalk"));
var import_glob = __toESM(require("glob"));
var import_mini_css_extract_plugin = __toESM(require("mini-css-extract-plugin"));
var import_css_minimizer_webpack_plugin = __toESM(require("css-minimizer-webpack-plugin"));
var import_react_refresh_webpack_plugin = __toESM(require("@pmmmwh/react-refresh-webpack-plugin"));
var import_webpackbar = __toESM(require("webpackbar"));
var import_clean_webpack_plugin = require("clean-webpack-plugin");
var import_webpack_dev_server = __toESM(require("webpack-dev-server"));
var import_webpack2 = __toESM(require("webpack"));
var import_webpack_merge2 = __toESM(require("webpack-merge"));
var import_html_webpack_plugin = __toESM(require("html-webpack-plugin"));
var import_address = require("address");

// src/tpl.ts
var tpl_default = `
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui,viewport-fit=cover"
    />
    <meta name="format-detection" content="telephone=no, email=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-touch-fullscreen" content="yes" />
    <title></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

// src/nodeLib.ts
var import_chalk = __toESM(require("chalk"));
var import_webpack = __toESM(require("webpack"));
var import_webpack_node_externals = __toESM(require("webpack-node-externals"));
var import_cheerio = __toESM(require("cheerio"));
var import_webpack_merge = __toESM(require("webpack-merge"));

// src/uploadAliOss.ts
var import_ali_oss = __toESM(require("ali-oss"));
var import_fs_extra = __toESM(require("fs-extra"));
var import_chalk2 = __toESM(require("chalk"));
var import_draftlog = __toESM(require("draftlog"));
import_draftlog.default.into(console);

// src/pack.ts
var defaultDevPort = 9e3;
var getProjectPath2 = (dir = "./") => {
  return import_path.default.join(import_process.default.cwd(), dir);
};
function exit(error) {
  console.log(import_chalk3.default.red(error));
  import_process.default.exit(9);
}
var getStyleLoaderUse = (type = "less", dev, custFun) => {
  let rules = [
    {
      loader: require.resolve("css-loader"),
      options: {
        sourceMap: dev
      }
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          plugins: [
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 3
            })
          ],
          sourceMap: dev
        }
      }
    }
  ];
  switch (type) {
    case "less": {
      rules.push({
        loader: require.resolve("less-loader"),
        options: {
          lessOptions: {
            relativeUrls: false,
            javascriptEnabled: true
          },
          sourceMap: dev
        }
      });
      break;
    }
    case "sass": {
      rules.push({
        loader: require.resolve("sass-loader"),
        options: {
          sourceMap: dev
        }
      });
      break;
    }
    case "custom": {
      if (typeof custFun === "function") {
        const rule = custFun();
        if (rule) {
          rules = rules.concat(rule);
        }
      }
      break;
    }
  }
  if (dev) {
    rules.unshift({ loader: require.resolve("style-loader") });
  } else {
    rules.unshift({
      loader: import_mini_css_extract_plugin.default.loader
    });
  }
  return rules;
};
var getBabelConfig = (dev) => {
  const plugins = [
    [require.resolve("@babel/plugin-transform-runtime")],
    [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
    [require.resolve("@babel/plugin-proposal-class-properties"), { loose: false }]
  ];
  if (dev) {
    plugins.push([require.resolve("react-refresh/babel")]);
  }
  return {
    cacheDirectory: true,
    presets: [
      [
        //include the transformations and polyfills for the features that we use and that are missing in our target browsers.
        require.resolve("@babel/preset-env"),
        {
          modules: "auto"
          // Setting this to false will preserve ES modules. Use this only if you intend to ship native ES Modules to browsers. If you are using a bundler with Babel, the default modules: "auto" is always preferred.
        }
      ],
      [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
      require.resolve("@babel/preset-typescript")
    ],
    plugins
  };
};
var getAssetConfig = (type) => {
  return {
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024
      }
    },
    generator: {
      filename: `${type}/[name].[hash:8][ext]`
    }
  };
};
var getHtmlPluginsConfig = (dirs = [], isDev) => {
  let hasTempalteFunc = import_fs.default.existsSync(getProjectPath2("./index.tpl.js"));
  if (!hasTempalteFunc && !import_fs.default.existsSync(getProjectPath2("./index.html"))) {
    import_fs.default.writeFileSync(getProjectPath2("./index.html"), tpl_default);
  }
  const htmlPlugins = [];
  for (let dir of dirs) {
    htmlPlugins.push(
      new import_html_webpack_plugin.default(
        Object.assign(
          {
            filename: `${dir}.html`,
            [hasTempalteFunc && !isDev ? "templateContent" : "template"]: hasTempalteFunc && !isDev ? ({ htmlWebpackPlugin }) => require(getProjectPath2("./index.tpl.js"))(htmlWebpackPlugin) : getProjectPath2("index.html"),
            chunks: [dir, "vendor", "common", "runtime"]
          },
          !isDev ? {
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
              minifyURLs: true
            }
          } : void 0
        )
      )
    );
  }
  return htmlPlugins;
};
var getWebpackConfig = (dev = true, entry = {}, publicPath = "/", target = "web", banner) => {
  const entryKeys = Object.keys(entry);
  const isNodeTarget = target === "node";
  const htmlPlugins = isNodeTarget ? [] : getHtmlPluginsConfig(entryKeys, dev);
  const name = entryKeys.join("-");
  const styleLoaders = !isNodeTarget ? [
    {
      test: /\.less$/,
      use: getStyleLoaderUse("less", dev)
    },
    {
      test: /\.s[ac]ss$/i,
      use: getStyleLoaderUse("sass", dev)
    },
    {
      test: /\.css$/,
      use: getStyleLoaderUse("css", dev)
    }
  ] : [
    {
      test: /\.(less|sass|scss|css)$/,
      use: require.resolve("./ignore")
    }
  ];
  const plugins = [
    new import_clean_webpack_plugin.CleanWebpackPlugin(),
    new import_webpack2.default.DefinePlugin({
      __dev__: dev
    })
  ];
  if (typeof banner === "string" && banner.trim()) {
    plugins.push(new import_webpackbar.default({ name: banner }));
  }
  if (!isNodeTarget) {
    plugins.push(
      new import_mini_css_extract_plugin.default({
        filename: `[name].[contenthash:6].css`,
        chunkFilename: `[name].[contenthash:6].css`
      })
    );
    plugins.push(...htmlPlugins);
  }
  const config = {
    mode: dev ? "development" : "production",
    bail: !dev,
    entry,
    output: {
      path: getProjectPath2("./dist"),
      chunkFilename: `[name].[contenthash:6].js`,
      filename: dev ? "[name].js" : `[name].[contenthash:6].js`,
      publicPath
    },
    devtool: dev ? "cheap-module-source-map" : false,
    target,
    cache: isNodeTarget ? false : dev ? {
      type: "filesystem",
      name,
      buildDependencies: {
        config: [__filename]
      },
      store: "pack"
    } : {
      type: "filesystem",
      name: name + "-prd",
      buildDependencies: {
        config: [__filename]
      },
      store: "pack"
    },
    module: {
      rules: [
        {
          test: /\.[j|t]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve("babel-loader"),
            options: getBabelConfig(dev)
          }
        },
        {
          test: /\.(png|jpg|gif|jpeg|svg)$/,
          ...getAssetConfig("images")
        },
        {
          test: /\.(ttf|otf|woff|woff2|eot)$/,
          ...getAssetConfig("fonts")
        },
        ...styleLoaders
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "~": getProjectPath2("./src"),
        "@": getProjectPath2("./src")
      }
    },
    optimization: {
      splitChunks: {
        name: false,
        cacheGroups: {
          common: {
            name: "common",
            chunks: "all",
            minChunks: 2
          },
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 10
          }
        }
      },
      runtimeChunk: isNodeTarget ? false : {
        name: "runtime"
      },
      moduleIds: dev ? "named" : "deterministic",
      chunkIds: dev ? "named" : "deterministic"
    },
    stats: "errors-warnings",
    plugins
  };
  if (dev) {
    config.plugins.push(
      new import_react_refresh_webpack_plugin.default({
        overlay: false
      })
    );
  } else {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [new import_css_minimizer_webpack_plugin.default(), "..."]
    };
  }
  return config;
};
var runWebpack = (config, openFile = "index", dev, devPort, devServerConfig, callback) => {
  if (dev) {
    const compiler = (0, import_webpack2.default)(config);
    const serverConfig = {
      compress: true,
      host: "0.0.0.0",
      disableHostCheck: true,
      hot: true,
      inline: true,
      noInfo: true,
      // If you also use a browser through some redirection (proxy, ssh redirect, …), use the devServer option sockPort: 'location',
      // so the socket port will use the same as the location port, which is usually enough
      sockPort: "location",
      ...devServerConfig
    };
    const port = serverConfig.port || devPort;
    const devServer = new import_webpack_dev_server.default(compiler, serverConfig);
    devServer.listen(port, serverConfig.host, (err) => {
      if (err) {
        exit(err);
      }
      const page = `${openFile === "index" ? "" : openFile + ".html"}`;
      const serveUrl = `http://localhost:${port}/${page}`;
      const serverUrlIp = `http://${(0, import_address.ip)()}:${port}/${page}`;
      console.log(import_chalk3.default.cyan("dev server is listening at"));
      console.log();
      console.log("> Local:", import_chalk3.default.green(`${serveUrl}`));
      console.log();
      console.log("> Network:", import_chalk3.default.green(`${serverUrlIp}`));
    });
    ["SIGINT", "SIGTERM"].forEach((sig) => {
      import_process.default.on(sig, () => {
        if (devServer) {
          devServer.close();
        }
        import_process.default.exit();
      });
    });
  } else {
    const compiler = (0, import_webpack2.default)(config);
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(stats);
      }
      compiler.close(() => {
        console.log(import_chalk3.default.green("done \u{1F37A} "));
        callback?.();
      });
    });
  }
};
var run = (dir = "index", publicPath = "/", dev = true, port = defaultDevPort) => {
  let s = import_glob.default.sync(`./src/${dir}/index{.jsx,.js,.ts,.tsx}`);
  let isDir = true;
  if (!s.length) {
    s = import_glob.default.sync(`./src/index{.jsx,.js,.ts,.tsx}`);
    if (!s.length) {
      exit(`Entry not found : ${getProjectPath2("./src/index")}`);
    }
    isDir = false;
  }
  const entryFile = s[0];
  const config = getWebpackConfig(dev, { [dir]: entryFile }, publicPath);
  runWebpack(config, isDir ? dir : "index", dev, port);
};

// src/index.ts
var program = new import_commander.Command("packw");
program.name("packw").usage("[options] start/build/run");
program.version(require_package().version, "-v, --version");
program.command("start").description("\u5F00\u53D1").option("-p, --port [port]", "\u7AEF\u53E3\u53F7", "9000").action((options) => {
  run("index", "/", true, options.port);
});
program.command("build").description("\u6784\u5EFA").option("-p, --public-path [publicPath]", "\u8BBE\u7F6EpublicPath, \u9ED8\u8BA4 /", "/").action((options) => {
  run("index", options.publicPath, false);
});
program.parse(process.argv);
if (process.argv.length < 3) {
  program.outputHelp();
}
