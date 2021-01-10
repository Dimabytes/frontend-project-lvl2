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

const objectToDiff = (obj) => Object
  .entries(obj)
  .map(([key, value]) => ({
    key,
    value,
    children: [],
    type: CHANGE_TYPES.unchanged,
  }));

const preFormat = (arr) => arr.map(({
  value, children, key, type,
}) => ({
  key,
  type,
  value,
  children: _.isObject(value) ? preFormat(objectToDiff(value)) : preFormat(children),
}));

const outputFormat = (arr, level) => {
  const innerData = arr.map(({
    type, children, value, key,
  }) => {
    const levelIndent = getLevelIndent(level);
    const sign = getSign(type);
    const outputString = children.length > 0 ? outputFormat(children, level + 1) : value;
    return `${levelIndent}${sign}${key}: ${outputString}`;
  }).join('\n');
  return `{\n${innerData}\n${getCloseLevelIndent(level)}}`;
};

const formatToStylish = (arr) => {
  const preFormatted = preFormat(arr);
  return outputFormat(preFormatted, 1);
};

const getSortedObjectsKeys = (obj1, obj2) => _
  .uniq([...Object.keys(obj1), ...Object.keys(obj2)])
  .sort();

const checkSimpleKey = (obj, key, type) => {
  if (_.has(obj, key)) {
    return {
      key,
      type,
      value: obj[key],
      children: [],
    };
  }
  return null;
};

const makeKeyDiff = (obj1, obj2, key) => {
  const value1 = obj1[key];
  const value2 = obj2[key];
  if (_.isObject(value1) && _.isObject(value2)) {
    return {
      key,
      type: CHANGE_TYPES.unchanged,
      value: null,
      children: getSortedObjectsKeys(value1, value2)
        .flatMap((newKey) => makeKeyDiff(value1, value2, newKey)),
    };
  }
  if (_.has(obj1, key) && _.has(obj2, key) && _.isEqual(value1, value2)) {
    return {
      key,
      type: CHANGE_TYPES.unchanged,
      value: value1,
      children: [],
    };
  }
  const diff = [];
  diff.push(checkSimpleKey(obj1, key, CHANGE_TYPES.removed));
  diff.push(checkSimpleKey(obj2, key, CHANGE_TYPES.added));
  return diff.filter((el) => el !== null);
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = parse(filepath1);
  const obj2 = parse(filepath2);
  const diff = getSortedObjectsKeys(obj1, obj2)
    .flatMap((newKey) => makeKeyDiff(obj1, obj2, newKey));
  if (format === 'stylish') {
    return formatToStylish(diff);
  }
  return '';
};

export default genDiff;
