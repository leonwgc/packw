/**
 *  编译commonjs库,用于node端渲染html
 *
 * @param {*} entry
 * @param {() => void} [callback]
 */
export declare const getSsrLib: (entry: any, callback?: () => void) => void;
/**
 *
 *
 * @param {string} htmlFilePath 文件路径
 * @param {string} [html=''] 注入的html
 * @param {string} [rootSelector='#root'] 注入到的html element 元素, 比如ReactDOM render的root container
 */
export declare const injectHtmlToRootNode: (htmlFilePath: string, html?: string, rootSelector?: string) => void;
