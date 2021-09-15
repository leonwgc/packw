import { Configuration } from 'webpack';
export { getSsrLib, injectHtmlToRootNode } from './lib';
export declare const getConfig: (isDev: boolean, entry: {}, publicPath?: string, target?: 'node' | 'web') => Configuration;
export declare const run: (dir?: string, publicPath?: string, isDev?: boolean, port?: number) => void;
/**
 * node自定义构建
 */
export default function packx(
/** 是否开发模式 */
isDev: boolean, 
/** webpack配置对象 */
config: Configuration, 
/** production模式构建完成执行的回调*/
callback?: () => void): void;
