/**
 * Build commonjs for node rendering.
 * @param entry webpack entry
 * @param output output folder , default ./ssr-lib
 * @param callback after build , callback will be invoked.
 */
export declare const getNodeLib: (entry: Record<string, string>, output?: string, callback?: () => void) => void;
/**
 * Inject html to html root node for hydration.
 * @param {string} htmlFile HTML file path
 * @param {string} [htmlContent=''] HTML content that will be injected.
 * @param {string} [rootSelector='#root'] Hydration root html element selector, default #root
 */
export declare const injectHtml: (htmlFile: string, htmlContent?: string, rootSelector?: string) => void;
