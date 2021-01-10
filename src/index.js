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

const makeObjectsDiffUnchanged = (obj) => Object.keys(obj)
  .map((newKey) => makeKeyDiff(obj, obj, newKey))
  .flat();

const makeObjectsDiff = (obj1, obj2) => _.uniq([...Object.keys(obj1), ...Object.keys(obj2)])
  .sort()
  .map((newKey) => makeKeyDiff(obj1, obj2, newKey))
  .flat();

const makeOneValueDiff = (val, key, type) => {
  if (_.isObject(val)) {
    return {
      key,
      children: makeObjectsDiffUnchanged(val),
      value: null,
      type,
    };
  }
  return {
    key,
    children: [],
    value: val,
    type,
  };
};

const makeChangeDiff = (val1, val2, key) => {
  if (val1 === val2) {
    return {
      key,
      children: [],
      value: val1,
      type: CHANGE_TYPES.unchanged,
    };
  }
  return [
    makeOneValueDiff(val1, key, CHANGE_TYPES.removed),
    makeOneValueDiff(val2, key, CHANGE_TYPES.added),
  ];
};

const makeKeyDiff = (obj1, obj2, key) => {
  const val1 = obj1[key];
  const val2 = obj2[key];

  if (_.isObject(val1) && _.isObject(val2)) {
    return {
      key,
      value: null,
      children: makeObjectsDiff(val1, val2),
      type: CHANGE_TYPES.unchanged,
    };
  }

  if (_.has(obj1, key) && _.has(obj2, key)) {
    return makeChangeDiff(val1, val2, key);
  }
  if (_.has(obj1, key)) {
    return makeOneValueDiff(val1, key, CHANGE_TYPES.removed);
  }
  return makeOneValueDiff(val2, key, CHANGE_TYPES.added);
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = parse(filepath1);
  const obj2 = parse(filepath2);
  const diff = makeObjectsDiff(obj1, obj2);
  if (format === 'stylish') {
    return formatToStylish(diff, 1);
  }
  return '';
};

export default genDiff;
