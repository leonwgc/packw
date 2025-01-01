var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/pack.ts
var pack_exports = {};
__export(pack_exports, {
  decryptSignedKey: () => decryptSignedKey,
  default: () => pack,
  encryptKey: () => encryptKey,
  getNodeLib: () => getNodeLib,
  getProjectPath: () => getProjectPath,
  getStyleLoaderUse: () => getStyleLoaderUse,
  getWebpackConfig: () => getWebpackConfig,
  injectHtml: () => injectHtml,
  run: () => run,
  uploadAliOss: () => uploadAliOss_default
});
module.exports = __toCommonJS(pack_exports);
var import_path3 = __toESM(require("path"));
var import_fs3 = __toESM(require("fs"));
var import_process4 = __toESM(require("process"));
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
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_webpack = __toESM(require("webpack"));
var import_process = __toESM(require("process"));
var import_webpack_node_externals = __toESM(require("webpack-node-externals"));
var import_cheerio = __toESM(require("cheerio"));
var import_webpack_merge = __toESM(require("webpack-merge"));
var import_process2 = require("process");
var getProjectPath = (dir = "./") => {
  return import_path.default.join(import_process.default.cwd(), dir);
};
var getNodeLib = (entry, output, callback) => {
  if (typeof output === "function") {
    callback = output;
    output = "./ssr-lib";
  }
  const config = getWebpackConfig(false, entry, "", "node");
  const ssrConfig = {
    entry,
    externals: [(0, import_webpack_node_externals.default)()],
    output: {
      path: getProjectPath(output),
      filename: "[name].js",
      library: {
        type: "commonjs2"
      }
    }
  };
  const mergeConfig = (0, import_webpack_merge.default)({}, config, ssrConfig);
  const compiler = (0, import_webpack.default)(mergeConfig);
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err.stack || err.message || err);
    }
    compiler.close(() => {
      console.log(import_chalk.default.green("library done \u{1F37A} "));
      callback?.();
    });
  });
};
var injectHtml = (htmlFile, htmlContent = "", rootSelector = "#root") => {
  if (import_fs.default.existsSync(htmlFile)) {
    try {
      const ohtml = import_fs.default.readFileSync(htmlFile, { encoding: "utf-8" });
      const $ = import_cheerio.default.load(ohtml);
      $(rootSelector).html(htmlContent);
      import_fs.default.writeFileSync(htmlFile, $.html());
    } catch (ex) {
      console.error(ex);
      (0, import_process2.exit)(1);
    }
  } else {
    console.error(htmlFile + "does not exist");
  }
};

// src/uploadAliOss.ts
var import_ali_oss = __toESM(require("ali-oss"));
var import_crypto = __toESM(require("crypto"));
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var import_fs_extra = __toESM(require("fs-extra"));
var import_chalk2 = __toESM(require("chalk"));
var import_process3 = __toESM(require("process"));
var import_draftlog = __toESM(require("draftlog"));
import_draftlog.default.into(console);
var envs = ["prd", "test"];
var uploadAliOss = async (config, ossFolder, env) => {
  const map = {
    test: "t-dist",
    prd: "dist"
  };
  if (!env) {
    exit3("env is required");
  }
  if (envs.indexOf(env) === -1) {
    exit3("env must be " + envs);
  }
  if (!import_fs_extra.default.pathExistsSync(import_path2.default.resolve(import_process3.default.cwd(), map[env]))) {
    exit3("dist not exit");
  }
  const { region, accessKeyId, accessKeySecret, bucket } = config;
  const client = new import_ali_oss.default({
    region,
    accessKeyId,
    accessKeySecret,
    bucket
  });
  let t = 0;
  async function putOSS(src, dist) {
    try {
      t++;
      await client.put(src, dist);
      t--;
    } catch (e) {
      exit3(e);
    }
  }
  function putFolderToOSS(dist, ossPath) {
    import_fs2.default.readdirSync(dist).forEach((file) => {
      var fileLocaton = import_path2.default.join(dist, file);
      var stats = import_fs2.default.lstatSync(fileLocaton);
      if (stats.isFile()) {
        putOSS(`${ossPath}${file}`, fileLocaton);
      } else if (stats.isDirectory()) {
        putFolderToOSS(fileLocaton, `${ossPath}${file}/`);
      }
    });
  }
  let distFolder = import_path2.default.resolve(import_process3.default.cwd(), `./${map[env]}/`);
  putFolderToOSS(distFolder, `${env}/${ossFolder}/`);
  let frame = 0;
  const frames = ["-", "\\", "|", "/"];
  const draft = console.draft();
  function Loading(text) {
    frame = (frame + 1) % frames.length;
    return import_chalk2.default.green(frames[frame]) + " " + import_chalk2.default.green(text);
  }
  const doneCheck = () => {
    if (t === 0) {
      console.log(import_chalk2.default.green(`${env === "prd" ? "production" : "non-production"} uploaded`));
      cleanup();
    } else {
      draft(Loading("oss uploading..."));
      setTimeout(doneCheck, 60);
    }
  };
  doneCheck();
  function exit3(error) {
    console.log(import_chalk2.default.red(error));
    import_process3.default.exit(9);
  }
  function cleanup() {
    const rm = import_fs2.default.rmSync ? import_fs2.default.rmSync : import_fs2.default.rmdirSync;
    rm(import_path2.default.resolve(import_process3.default.cwd(), `./${map[env]}`), {
      recursive: true
    });
  }
};
var key = "9vApxLk5G3PAsJXM";
var iv = "FnJL7EDzjqWjcaX9";
function encryptKey(src) {
  let sign = "";
  const cipher = import_crypto.default.createCipheriv("aes-128-cbc", key, iv);
  sign += cipher.update(src, "utf8", "hex");
  sign += cipher.final("hex");
  return sign;
}
function decryptSignedKey(sign) {
  let src = "";
  const cipher = import_crypto.default.createDecipheriv("aes-128-cbc", key, iv);
  src += cipher.update(sign, "hex", "utf8");
  src += cipher.final("utf8");
  return src;
}
var uploadAliOss_default = uploadAliOss;

// src/pack.ts
var defaultDevPort = 9e3;
var getProjectPath2 = (dir = "./") => {
  return import_path3.default.join(import_process4.default.cwd(), dir);
};
function exit2(error) {
  console.log(import_chalk3.default.red(error));
  import_process4.default.exit(9);
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
  let hasTempalteFunc = import_fs3.default.existsSync(getProjectPath2("./index.tpl.js"));
  if (!hasTempalteFunc && !import_fs3.default.existsSync(getProjectPath2("./index.html"))) {
    import_fs3.default.writeFileSync(getProjectPath2("./index.html"), tpl_default);
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
        exit2(err);
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
      import_process4.default.on(sig, () => {
        if (devServer) {
          devServer.close();
        }
        import_process4.default.exit();
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
      exit2(`Entry not found : ${getProjectPath2("./src/index")}`);
    }
    isDir = false;
  }
  const entryFile = s[0];
  const config = getWebpackConfig(dev, { [dir]: entryFile }, publicPath);
  runWebpack(config, isDir ? dir : "index", dev, port);
};
function pack(dev, config, callback, banner) {
  const { entry, devServer = {}, ...others } = config;
  if (typeof entry === "object" && entry && Object.keys(entry).length) {
    const keys = Object.keys(entry);
    const config2 = getWebpackConfig(
      dev,
      entry,
      "/",
      "web",
      banner || "app"
    );
    const finalConfig = (0, import_webpack_merge2.default)({}, config2, others);
    return runWebpack(finalConfig, keys[0], dev, defaultDevPort, devServer, callback);
  } else {
    exit2("Entry not found");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decryptSignedKey,
  encryptKey,
  getNodeLib,
  getProjectPath,
  getStyleLoaderUse,
  getWebpackConfig,
  injectHtml,
  run,
  uploadAliOss
});
