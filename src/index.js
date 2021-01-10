/* eslint-disable no-use-before-define */
import _ from 'lodash';
import parse from './parsers.js';

const CHANGE_TYPES = {
  unchanged: 'unchanged',
  removed: 'removed',
  added: 'added',
};
const getLevelIndent = (level) => ' '.repeat(level * 4 - 2);

const getCloseLevelIndent = (level) => ' '.repeat((level - 1) * 4);

const getSign = (type) => {
  switch (type) {
    case CHANGE_TYPES.added:
      return '+ ';
    case CHANGE_TYPES.removed:
      return '- ';
    case CHANGE_TYPES.unchanged:
      return '  ';
    default:
      return null;
  }
};

const formatToStylish = (obj, level) => {
  const innerData = obj.map((val) => {
    const levelIndent = getLevelIndent(level);
    const sign = getSign(val.type);
    const value = val.children.length > 0 ? formatToStylish(val.children, level + 1) : val.value;
    return `${levelIndent}${sign}${val.key}: ${value}`;
  }).join('\n');
  return `{\n${innerData}\n${getCloseLevelIndent(level)}}`;
};

const makeKeyDiff = (obj1, obj2, key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];

  if (_.isObject(value1) && _.isObject(value2)) {
    const sortedObjectsKeys = getSortedObjectsKeys(value1, value2);
    return {
      key,
      value: null,
      children: makeDiffOnKeys(sortedObjectsKeys, value1, value2),
      type: CHANGE_TYPES.unchanged,
    };
  }

  if (_.has(obj1, key) && _.has(obj2, key)) {
    return makeTwoValuesDiff(value1, value2, key);
  }
  if (_.has(obj1, key)) {
    return makeOneValueDiff(value1, key, CHANGE_TYPES.removed);
  }
  return makeOneValueDiff(value2, key, CHANGE_TYPES.added);
};

const getSortedObjectsKeys = (obj1, obj2) => _
  .uniq([...Object.keys(obj1), ...Object.keys(obj2)])
  .sort();

const makeDiffOnKeys = (keys, obj1, obj2) => keys
  .map((newKey) => makeKeyDiff(obj1, obj2, newKey))
  .flat();

const makeOneValueDiff = (value, key, type) => {
  if (_.isObject(value)) {
    return {
      key,
      children: makeDiffOnKeys(Object.keys(value), value, value),
      value: null,
      type,
    };
  }
  return {
    key,
    children: [],
    value,
    type,
  };
};

const makeTwoValuesDiff = (value1, value2, key) => {
  if (_.isEqual(value1, value2)) {
    return {
      key,
      children: [],
      value: value1,
      type: CHANGE_TYPES.unchanged,
    };
  }
  return [
    makeOneValueDiff(value1, key, CHANGE_TYPES.removed),
    makeOneValueDiff(value2, key, CHANGE_TYPES.added),
  ];
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = parse(filepath1);
  const obj2 = parse(filepath2);
  const sortedObjectsKeys = getSortedObjectsKeys(obj1, obj2);
  const diff = makeDiffOnKeys(sortedObjectsKeys, obj1, obj2);
  if (format === 'stylish') {
    return formatToStylish(diff, 1);
  }
  return '';
};

export default genDiff;
