import { Configuration } from 'webpack';
export { getSsrLib, injectHtmlToRootNode } from './lib';
export declare const getConfig: (isDev: boolean, entry: {}, publicPath?: string, target?: 'node' | 'web') => Configuration;
export declare const run: (dir?: string, publicPath?: string, isDev?: boolean, port?: number) => void;
/**
 * node自定义构建
 *
 * @export
 * @param {boolean} isDev 是否开发模式
 * @param {Configuration} config webpack Configuration配置
 * @param {() => void} [callback] 非开发模式编译完成的回调
 * @return {*}
 */
export default function packx(isDev: boolean, config: Configuration, callback?: () => void): void;
