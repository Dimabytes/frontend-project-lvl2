import path from 'path';
import fs from 'fs';
import parse from './src/parsers.js';
import format from './src/formatters/index.js';
import makeObjectsDiff from './src/makeObjectsDiff.js';

const readFile = (filepath) => fs.readFileSync(filepath, 'utf-8');

const getFormat = (filepath) => path.extname(filepath).slice(1);

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const rawFile1 = readFile(filepath1);
  const rawFile2 = readFile(filepath2);
  const obj1 = parse(rawFile1, getFormat(filepath1));
  const obj2 = parse(rawFile2, getFormat(filepath2));
  const diff = makeObjectsDiff(obj1, obj2);
  return format(diff, formatName);
};

export default genDiff;
