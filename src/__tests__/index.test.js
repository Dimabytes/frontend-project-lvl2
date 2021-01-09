import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('gendiff', () => {
  test('flat diff', () => {
    const diff = genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.json'),
    );

    expect(diff).toBe(readFile('flatExpectedStylish.txt').toString());
  });
});
