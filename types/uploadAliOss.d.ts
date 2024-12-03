type AliOSSConfig = {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
};
declare const uploadAliOss: (config: AliOSSConfig, ossFolder: string, env: "prd" | "test") => Promise<void>;
/**
 * encrypt a key
 * @param src
 * @returns
 */
export declare function encryptKey(src: any): string;
/**
 * decrypt a signed key
 * @param sign
 * @returns
 */
export declare function decryptSignedKey(sign: any): string;
export default uploadAliOss;
