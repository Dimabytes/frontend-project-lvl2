import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const expectedStylish = readFile('expectedStylish.txt');
const expectedPlain = readFile('expectedPlain.txt');
const expectedJson = readFile('expectedJson.txt');

describe('gendiff', () => {
  test('two json', () => {
    const diff = genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.json'),
      'stylish',
    );
    expect(diff).toBe(expectedStylish);
  });

  test('json and yaml', () => {
    const diff = genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.yml'),
    );
    expect(diff).toBe(expectedStylish);
  });

  test('plain formatter', () => {
    const diff = genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.yml'),
      'plain',
    );
    expect(diff).toBe(expectedPlain);
  });
  test('json formatter', () => {
    const diff = genDiff(
      getFixturePath('file1.json'),
      getFixturePath('file2.yml'),
      'json',
    );
    expect(diff).toBe(expectedJson);
  });
});
