import fs from 'fs';
import path from 'path';

import { config } from './config';

export const initCache = (): void => {
  if (!fs.existsSync(config.cache_path)) {
    fs.mkdirSync(config.cache_path);
  }
};

export const clearCache = (): void => {
  if (fs.existsSync(config.cache_path)) {
    fs.rmSync(config.cache_path, { recursive: true });
  }
}

export const readFile = (filename: string): any | undefined => {
  const filePath = generateFilePath(filename);
  if (fs.existsSync(filePath)) {
    const dataString = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const data = JSON.parse(dataString);
    return data;
  }
};

/**
 * @return {string} filepath
 */
export const writeFile = (filename: string, data: any): string => {
  const filePath = generateFilePath(filename);
  const dataString = JSON.stringify(data);
  fs.writeFileSync(filePath, dataString);
  return filePath;
};

export const checkFileExists = (filename: string): boolean => {
  const filePath = generateFilePath(filename);
  return fs.existsSync(filePath);
}

const generateFilePath = (filename: string): string => path.join(config.cache_path, filename);
