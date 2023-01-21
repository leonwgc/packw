import OSS from 'ali-oss';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import chalk from 'chalk';
import process from 'process';
import draftlog from 'draftlog';

draftlog.into(console);

const envs = ['prd', 'test'];

type AliOSSConfig = {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
};

const uploadAliOss = async (config: AliOSSConfig, ossFolder: string, env: 'prd' | 'test') => {
  const map = {
    test: 't-dist',
    prd: 'dist',
  };

  if (!env) {
    exit('env is required');
  }

  if (envs.indexOf(env) === -1) {
    exit('env must be ' + envs);
  }

  if (!fse.pathExistsSync(path.resolve(process.cwd(), map[env]))) {
    exit('dist not exit');
  }

  const { region, accessKeyId, accessKeySecret, bucket } = config;

  const client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
  });

  let t = 0;

  async function putOSS(src, dist) {
    try {
      t++;
      await client.put(src, dist);
      t--;
    } catch (e) {
      exit(e);
    }
  }

  // put all files/dirs under dist to ossPath
  function putFolderToOSS(dist, ossPath) {
    fs.readdirSync(dist).forEach((file) => {
      var fileLocaton = path.join(dist, file);
      var stats = fs.lstatSync(fileLocaton);
      if (stats.isFile()) {
        putOSS(`${ossPath}${file}`, fileLocaton);
      } else if (stats.isDirectory()) {
        putFolderToOSS(fileLocaton, `${ossPath}${file}/`);
      }
    });
  }

  let distFolder = path.resolve(process.cwd(), `./${map[env]}/`);

  putFolderToOSS(distFolder, `${env}/${ossFolder}/`);

  let frame = 0;
  const frames = ['-', '\\', '|', '/'];
  const draft = console.draft();

  function Loading(text) {
    frame = (frame + 1) % frames.length;
    return chalk.green(frames[frame]) + ' ' + chalk.green(text);
  }

  const doneCheck = () => {
    if (t === 0) {
      console.log(chalk.green(`${env === 'prd' ? 'production' : 'non-production'} uploaded`));
      cleanup();
    } else {
      draft(Loading('oss uploading...'));
      setTimeout(doneCheck, 60);
    }
  };

  doneCheck();

  function exit(error) {
    console.log(chalk.red(error));
    process.exit(9);
  }

  function cleanup() {
    const rm = fs.rmSync ? fs.rmSync : fs.rmdirSync;
    rm(path.resolve(process.cwd(), `./${map[env]}`), {
      recursive: true,
    });
  }
};

const key = '9vApxLk5G3PAsJXM';
const iv = 'FnJL7EDzjqWjcaX9';
/**
 * encrypt a key
 * @param src
 * @returns
 */
export function encryptKey(src) {
  let sign = '';
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

/**
 * decrypt a signed key
 * @param sign
 * @returns
 */
export function decryptSignedKey(sign) {
  let src = '';
  const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}

export default uploadAliOss;
