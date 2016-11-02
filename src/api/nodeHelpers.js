import { statSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { promisify, resolve } from 'bluebird';

const pMkdirSync = promisify(mkdirSync);

export const fileExists = (path) => {
  try {
    return statSync(path).isFile();
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('File does not exist.');
      return false;
    }

    console.log(`Exception fs.statSync (${path}): ${e}`);
    throw e;
  }
};

export const directoryExists = (path) => {
  try {
    return statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
};