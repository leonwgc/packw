import { Configuration } from 'webpack';
export declare const run: (dir?: string, publicPath?: string, isDev?: boolean, port?: number) => void;
export declare const pack: (isDev?: boolean) => void;
export default function nodeApi(isDev: boolean, config: Configuration, callback?: () => void): void;
