import { Configuration } from 'webpack';
export { getSsrLib, injectHtmlToRootNode } from './lib';
export declare const getConfig: (isDev: boolean, entry: {}, publicPath?: string, target?: 'node' | 'web') => Configuration;
export declare const run: (dir?: string, publicPath?: string, isDev?: boolean, port?: number) => void;
export declare const pack: (isDev?: boolean) => void;
/**
 * node-api自定义构建
 */
export default function packx(isDev: boolean /** 是否development开发模式 */, config: Configuration /** webpack配置对象 */, callback?: () => void /** production模式构建完成执行的回调*/): void;
