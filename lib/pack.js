"use strict";/* eslint-disable no-console */var __assign=function(){return __assign=Object.assign||function(a){for(var b,c=1,d=arguments.length;c<d;c++)for(var e in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,e)&&(a[e]=b[e]);return a},__assign.apply(this,arguments)},__rest=function(a,b){var c={};for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&0>b.indexOf(d)&&(c[d]=a[d]);if(null!=a&&"function"==typeof Object.getOwnPropertySymbols)for(var e=0,d=Object.getOwnPropertySymbols(a);e<d.length;e++)0>b.indexOf(d[e])&&Object.prototype.propertyIsEnumerable.call(a,d[e])&&(c[d[e]]=a[d[e]]);return c},__spreadArray=function(a,b,c){if(c||2===arguments.length)for(var d,e=0,f=b.length;e<f;e++)(d||!(e in b))&&(d||(d=Array.prototype.slice.call(b,0,e)),d[e]=b[e]);return a.concat(d||Array.prototype.slice.call(b))},__importDefault=function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.getWebpackConfig=exports.getStyleLoaderUse=exports.uploadAliOss=exports.decryptSignedKey=exports.encryptKey=exports.getProjectPath=exports.injectHtml=exports.getNodeLib=void 0;var path_1=__importDefault(require("path")),fs_1=__importDefault(require("fs")),process_1=__importDefault(require("process")),chalk_1=__importDefault(require("chalk")),glob_1=__importDefault(require("glob")),mini_css_extract_plugin_1=__importDefault(require("mini-css-extract-plugin")),css_minimizer_webpack_plugin_1=__importDefault(require("css-minimizer-webpack-plugin")),react_refresh_webpack_plugin_1=__importDefault(require("@pmmmwh/react-refresh-webpack-plugin")),webpackbar_1=__importDefault(require("webpackbar")),clean_webpack_plugin_1=require("clean-webpack-plugin"),webpack_dev_server_1=__importDefault(require("webpack-dev-server")),webpack_1=__importDefault(require("webpack")),webpack_merge_1=__importDefault(require("webpack-merge")),html_webpack_plugin_1=__importDefault(require("html-webpack-plugin")),address_1=require("address"),tpl_1=__importDefault(require("./tpl")),nodeLib_1=require("./nodeLib");Object.defineProperty(exports,"getNodeLib",{enumerable:!0,get:function(){return nodeLib_1.getNodeLib}}),Object.defineProperty(exports,"injectHtml",{enumerable:!0,get:function(){return nodeLib_1.injectHtml}}),Object.defineProperty(exports,"getProjectPath",{enumerable:!0,get:function(){return nodeLib_1.getProjectPath}});var uploadAliOss_1=require("./uploadAliOss");Object.defineProperty(exports,"encryptKey",{enumerable:!0,get:function(){return uploadAliOss_1.encryptKey}}),Object.defineProperty(exports,"decryptSignedKey",{enumerable:!0,get:function(){return uploadAliOss_1.decryptSignedKey}}),Object.defineProperty(exports,"uploadAliOss",{enumerable:!0,get:function(){return __importDefault(uploadAliOss_1).default}});var defaultDevPort=9e3,getProjectPath=function(a){return void 0===a&&(a="./"),path_1.default.join(process_1.default.cwd(),a)};function exit(a){console.log(chalk_1.default.red(a)),process_1.default.exit(9)}/**
 * Get style loaders use setting
 * @param type
 * @param dev
 * @param custFun
 * @returns
 */var getStyleLoaderUse=function(a,b,c){void 0===a&&(a="less");var d=[{loader:require.resolve("css-loader"),options:{sourceMap:b}},{loader:require.resolve("postcss-loader"),options:{postcssOptions:{plugins:[require("postcss-preset-env")({autoprefixer:{flexbox:"no-2009"},stage:3})],sourceMap:b}}}];switch(a){case"less":{d.push({loader:require.resolve("less-loader"),options:{lessOptions:{relativeUrls:!1,javascriptEnabled:!0},sourceMap:b}});break}case"sass":{d.push({loader:require.resolve("sass-loader"),options:{sourceMap:b}});break}case"custom":{if("function"==typeof c){var e=c();e&&(d=d.concat(e))}break}}return b?d.unshift({loader:require.resolve("style-loader")}):d.unshift({loader:mini_css_extract_plugin_1.default.loader}),d};exports.getStyleLoaderUse=getStyleLoaderUse;/**
 * Babel config
 * @param dev
 * @returns
 */var getBabelConfig=function(a){var b=[[require.resolve("@babel/plugin-transform-runtime")],[require.resolve("@babel/plugin-proposal-decorators"),{legacy:!0}],[require.resolve("@babel/plugin-proposal-class-properties"),{loose:!1}]];return a&&b.push([require.resolve("react-refresh/babel")]),{cacheDirectory:!0,presets:[[//include the transformations and polyfills for the features that we use and that are missing in our target browsers.
require.resolve("@babel/preset-env"),{modules:"auto"// Setting this to false will preserve ES modules. Use this only if you intend to ship native ES Modules to browsers. If you are using a bundler with Babel, the default modules: "auto" is always preferred.
}],[require.resolve("@babel/preset-react"),{runtime:"automatic"}],require.resolve("@babel/preset-typescript")],plugins:b}},getAssetConfig=function(a){return{type:"asset",parser:{dataUrlCondition:{maxSize:8192}},generator:{filename:"".concat(a,"/[name].[hash:8][ext]")}}},getHtmlPluginsConfig=function(a,b){var c;void 0===a&&(a=[]);// Check & emit index.html in project root
var d=fs_1.default.existsSync(getProjectPath("./index.tpl.js"));d||fs_1.default.existsSync(getProjectPath("./index.html"))||fs_1.default.writeFileSync(getProjectPath("./index.html"),tpl_1.default);for(var e,f=[],g=0,h=a;g<h.length;g++)e=h[g],f.push(new html_webpack_plugin_1.default(Object.assign((c={filename:"".concat(e,".html")},c[d&&!b?"templateContent":"template"]=d&&!b?function(a){var b=a.htmlWebpackPlugin;return require(getProjectPath("./index.tpl.js"))(b)}:getProjectPath("index.html"),c.chunks=[e,"vendor","common","runtime"],c),b?void 0:{minify:{removeComments:!0,collapseWhitespace:!0,removeRedundantAttributes:!0,useShortDoctype:!0,removeEmptyAttributes:!0,removeStyleLinkTypeAttributes:!0,keepClosingSlash:!0,minifyJS:!0,minifyCSS:!0,minifyURLs:!0}})));return f},getWebpackConfig=function(a,b,c,d,e){void 0===a&&(a=!0),void 0===b&&(b={}),void 0===c&&(c="/"),void 0===d&&(d="web");var f=Object.keys(b),g="node"===d,h=g?[]:getHtmlPluginsConfig(f,a),i=f.join("-"),j=g?[{test:/\.(less|sass|scss|css)$/,use:require.resolve("./ignore")}]:[{test:/\.less$/,use:(0,exports.getStyleLoaderUse)("less",a)},{test:/\.s[ac]ss$/i,use:(0,exports.getStyleLoaderUse)("sass",a)},{test:/\.css$/,use:(0,exports.getStyleLoaderUse)("css",a)}],k=[new clean_webpack_plugin_1.CleanWebpackPlugin,new webpack_1.default.DefinePlugin({__dev__:a})];"string"==typeof e&&e.trim()&&k.push(new webpackbar_1.default({name:e})),g||(k.push(new mini_css_extract_plugin_1.default({filename:"[name].[contenthash:6].css",chunkFilename:"[name].[contenthash:6].css"})),k.push.apply(k,h));var l={mode:a?"development":"production",bail:!a,entry:b,output:{path:getProjectPath("./dist"),chunkFilename:"[name].[contenthash:6].js",filename:a?"[name].js":"[name].[contenthash:6].js",publicPath:c},devtool:!!a&&"cheap-module-source-map",target:d,cache:!g&&(a?{type:"filesystem",name:i,buildDependencies:{config:[__filename]},store:"pack"}:{type:"filesystem",name:i+"-prd",buildDependencies:{config:[__filename]},store:"pack"}),module:{rules:__spreadArray([{test:/\.[j|t]sx?$/,exclude:/node_modules/,use:{loader:require.resolve("babel-loader"),options:getBabelConfig(a)}},__assign({test:/\.(png|jpg|gif|jpeg|svg)$/},getAssetConfig("images")),__assign({test:/\.(ttf|otf|woff|woff2|eot)$/},getAssetConfig("fonts"))],j,!0)},resolve:{extensions:[".js",".jsx",".ts",".tsx"],alias:{"~":getProjectPath("./src"),"@":getProjectPath("./src")}},optimization:{splitChunks:{name:!1,cacheGroups:{common:{name:"common",chunks:"all",minChunks:2},vendor:{name:"vendor",test:/[\\/]node_modules[\\/]/,chunks:"all",priority:10}}},runtimeChunk:!g&&{name:"runtime"},moduleIds:a?"named":"deterministic",chunkIds:a?"named":"deterministic"},stats:"errors-warnings",plugins:k};return a?l.plugins.push(new react_refresh_webpack_plugin_1.default({overlay:!1})):l.optimization=__assign(__assign({},l.optimization),{minimize:!0,minimizer:[new css_minimizer_webpack_plugin_1.default,"..."]}),l};/**
 * Get static asset config
 * @param type
 * @returns
 *//**
 * Get html-webpack-plugins config and prepare the html template
 * @param dirs
 * @param isDev
 * @returns
 *//**
 * Get a webpack configuration
 * @param dev
 * @param entry
 * @param publicPath
 * @param target
 * @param banner
 * @returns
 */exports.getWebpackConfig=getWebpackConfig;/**
 * Run webpack on configuration
 * @param config
 * @param openFile default index, open index.html by default.
 * @param dev boolean, whether run in dev mode
 * @param devPort
 * @param devServerConfig
 * @param callback
 */var runWebpack=function(a,b,c,d,e,f){if(void 0===b&&(b="index"),c){var g=(0,webpack_1.default)(a),h=__assign({compress:!0,host:"0.0.0.0",disableHostCheck:!0,hot:!0,inline:!0,noInfo:!0,// If you also use a browser through some redirection (proxy, ssh redirect, …), use the devServer option sockPort: 'location',
// so the socket port will use the same as the location port, which is usually enough
sockPort:"location"},e),i=h.port||d,j=new webpack_dev_server_1.default(g,h);// dont upgrade dev server to 5.x.
j.listen(i,h.host,function(a){a&&exit(a);var c="".concat("index"===b?"":b+".html"),d="http://localhost:".concat(i,"/").concat(c),e="http://".concat((0,address_1.ip)(),":").concat(i,"/").concat(c);console.log(chalk_1.default.cyan("dev server is listening at")),console.log(),console.log("> Local:",chalk_1.default.green("".concat(d))),console.log(),console.log("> Network:",chalk_1.default.green("".concat(e)))}),["SIGINT","SIGTERM"].forEach(function(a){process_1.default.on(a,function(){j&&j.close(),process_1.default.exit()})})}else{var k=(0,webpack_1.default)(a);k.run(function(a,b){(a||b.hasErrors())&&console.log(b),k.close(function(){console.log(chalk_1.default.green("done \uD83C\uDF7A ")),null===f||void 0===f?void 0:f()})})}},run=function(a,b,c,d){var e;void 0===a&&(a="index"),void 0===b&&(b="/"),void 0===c&&(c=!0),void 0===d&&(d=defaultDevPort);var f=glob_1.default.sync("./src/".concat(a,"/index{.jsx,.js,.ts,.tsx}")),g=!0;f.length||(f=glob_1.default.sync("./src/index{.jsx,.js,.ts,.tsx}"),!f.length&&exit("Entry not found : ".concat(getProjectPath("./src/index"))),g=!1);var h=f[0],i=(0,exports.getWebpackConfig)(c,(e={},e[a]=h,e),b);runWebpack(i,g?a:"index",c,d)};/**
 * SPA build, used for cli build
 * @param dir
 * @param publicPath
 * @param dev
 * @param port
 */exports.run=run;/**
 * Node build
 *
 * @export
 * @param {boolean} dev whether run in dev mode
 * @param {Configuration} config Webpack configuration
 * @param {() => void} callback callback after production build finished.
 * @param {string} banner banner text
 */function pack(a,b,c,d){var e=b.entry,f=b.devServer,g=void 0===f?{}:f,h=__rest(b,["entry","devServer"]);if("object"==typeof e&&e&&Object.keys(e).length){var i=Object.keys(e),j=(0,exports.getWebpackConfig)(a,e,"/","web",d||"app"),k=(0,webpack_merge_1.default)({},j,h);return runWebpack(k,i[0],a,defaultDevPort,g,c)}exit("Entry not found")}exports.default=pack;