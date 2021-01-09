import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('flat gendiff', () => {
  test('two json', () => {
    const diff = genDiff(
      getFixturePath('flat/file1.json'),
      getFixturePath('flat/file2.json'),
    );
    expect(diff).toBe(readFile('flat/expected.txt').toString());
  });

  test('two yaml', () => {
    const diff = genDiff(
      getFixturePath('flat/file1.yml'),
      getFixturePath('flat/file2.yml'),
    );
    expect(diff).toBe(readFile('flat/expected.txt').toString());
  });

  test('json and yaml', () => {
    const diff = genDiff(
      getFixturePath('flat/file1.json'),
      getFixturePath('flat/file2.yml'),
    );
    expect(diff).toBe(readFile('flat/expected.txt').toString());
  });
});
