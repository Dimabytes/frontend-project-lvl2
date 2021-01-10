import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const getSortedObjectsKeys = (obj1, obj2) => _
  .uniq([...Object.keys(obj1), ...Object.keys(obj2)])
  .sort();

const makeKeyDiff = (obj1, obj2, key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];
  if (_.isObject(value1) && _.isObject(value2)) {
    const children = getSortedObjectsKeys(value1, value2)
      .map((newKey) => makeKeyDiff(value1, value2, newKey));
    return {
      key, type: 'unchanged', value: null, children,
    };
  }
  if (_.has(obj1, key) && _.has(obj2, key)) {
    if (_.isEqual(value1, value2)) {
      return {
        key, type: 'unchanged', value: value1, children: [],
      };
    }
    return {
      key, type: 'changed', value: { value1, value2 }, children: [],
    };
  }
  if (_.has(obj1, key)) {
    return {
      key, type: 'removed', value: value1, children: [],
    };
  }
  return {
    key, type: 'added', value: value2, children: [],
  };
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const obj1 = parse(filepath1);
  const obj2 = parse(filepath2);
  const diff = getSortedObjectsKeys(obj1, obj2)
    .map((newKey) => makeKeyDiff(obj1, obj2, newKey));
  const formatter = getFormatter(formatName);
  return formatter(diff);
};

export default genDiff;
