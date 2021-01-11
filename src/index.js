import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const getSortedObjectsKeys = (obj1, obj2) => _
  .uniq([...Object.keys(obj1), ...Object.keys(obj2)])
  .sort();

const makeKeyDiff = (obj1, obj2, key) => {
  const oldValue = obj1[key];
  const newValue = obj2[key];
  if (_.isObject(oldValue) && _.isObject(newValue)) {
    const children = getSortedObjectsKeys(oldValue, newValue)
      .map((newKey) => makeKeyDiff(oldValue, newValue, newKey));
    return {
      key, type: 'unchanged', value: null, children,
    };
  }
  if (_.has(obj1, key) && _.has(obj2, key)) {
    if (_.isEqual(oldValue, newValue)) {
      return {
        key, type: 'unchanged', value: oldValue, children: [],
      };
    }
    return {
      key, type: 'changed', value: { oldValue, newValue }, children: [],
    };
  }
  if (_.has(obj1, key)) {
    return {
      key, type: 'removed', value: oldValue, children: [],
    };
  }
  return {
    key, type: 'added', value: newValue, children: [],
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
