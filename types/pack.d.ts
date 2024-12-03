import webpack, { Configuration, RuleSetRule } from 'webpack';
export { getNodeLib, injectHtml, getProjectPath } from './nodeLib';
export { encryptKey, decryptSignedKey, default as uploadAliOss } from './uploadAliOss';
type CssHandleType = 'less' | 'sass' | 'css' | 'custom';
type CssHandleCustFun = () => RuleSetRule | RuleSetRule[] | null;
/**
 * Get style loaders use setting
 * @param type
 * @param dev
 * @param custFun
 * @returns
 */
export declare const getStyleLoaderUse: (type: CssHandleType, dev: boolean, custFun?: CssHandleCustFun) => webpack.RuleSetRule[];
/**
 * Get a webpack configuration
 * @param dev
 * @param entry
 * @param publicPath
 * @param target
 * @returns
 */
export declare const getWebpackConfig: (dev?: boolean, entry?: Record<string, string>, publicPath?: string, target?: "node" | "web") => Configuration;
/**
 * SPA build, used for cli build
 * @param dir
 * @param publicPath
 * @param dev
 * @param port
 */
export declare const run: (dir?: string, publicPath?: string, dev?: boolean, port?: number) => void;
/**
 * Node build
 *
 * @export
 * @param {boolean} dev Build for dev?
 * @param {Configuration} config Webpack configuration object
 * @param {() => void} callback Be invoked after production build successfully
 */
export default function pack(dev: boolean, config: Configuration, callback?: () => void): void;
