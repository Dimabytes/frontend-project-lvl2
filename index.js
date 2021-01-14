import path from 'path';
import fs from 'fs';
import parse from './src/parsers.js';
import format from './src/formatters/index.js';
import makeKeyDiff from './src/makeDiff.js';

const getAbsolutePath = (filepath) => {
  if (filepath.startsWith('/')) {
    return filepath;
  }
  return path.resolve(process.cwd(), filepath);
};

const readFile = (filepath) => {
  const absolutePath = getAbsolutePath(filepath);
  return fs.readFileSync(absolutePath, 'utf-8');
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const rawFile1 = readFile(filepath1);
  const rawFile2 = readFile(filepath2);
  const obj1 = parse(rawFile1, path.extname(filepath1));
  const obj2 = parse(rawFile2, path.extname(filepath2));
  const diff = makeKeyDiff(obj1, obj2);
  return format(diff, formatName);
};

export default genDiff;
