import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

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

const parse = (filepath) => {
  const format = path.extname(filepath);
  const data = readFile(filepath);
  switch (format) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
      return yaml.load(data);
    default:
      throw new Error('Unknown file format');
  }
};

export default parse;
