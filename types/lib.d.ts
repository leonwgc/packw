/**
 * Build commonjs for node rendering.
 * @param entry webpack entry
 * @param output output folder , default ./ssr-lib
 * @param callback after build , callback will be invoked.
 */
export declare const getSsrLib: (entry: Record<string, string>, output?: string, callback?: () => void) => void;
