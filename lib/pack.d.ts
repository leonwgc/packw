import { Configuration } from 'webpack';
export { getSsrLib, injectHtmlToRootNode } from './lib';
export declare const getConfig: (isDev: boolean, entry: {}, publicPath?: string, target?: 'node' | 'web') => Configuration;
export declare const run: (dir?: string, publicPath?: string, isDev?: boolean, port?: number) => void;
export declare const pack: (isDev?: boolean) => void;
export default function nodeApi(isDev: boolean, config: Configuration, callback?: () => void): void;
