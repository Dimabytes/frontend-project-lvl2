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

const formatObj = (obj, level) => {
  const innerData = Object.keys(obj).map((key) => {
    const val = obj[key];
    const levelIndent = getLevelIndent(level);
    const outputString = _.isObject(val) ? formatObj(val, level + 1) : val;
    return `${levelIndent}  ${key}: ${outputString}`;
  }).join('\n');
  return `{\n${innerData}\n${getCloseLevelIndent(level)}}`;
};

const formatToStylish = (obj, level) => {
  const getOutputString = (val) => {
    if (val.children.length > 0) {
      return formatToStylish(val.children, level + 1);
    }
    if (_.isObject(val.value)) {
      return formatObj(val.value, level + 1);
    }
    return val.value;
  };
  const innerData = obj.map((val) => {
    const levelIndent = getLevelIndent(level);
    const sign = getSign(val.type);
    const outputString = getOutputString(val);
    return `${levelIndent}${sign}${val.key}: ${outputString}`;
  }).join('\n');
  return `{\n${innerData}\n${getCloseLevelIndent(level)}}`;
};

const getSortedObjectsKeys = (obj1, obj2) => _
  .uniq([...Object.keys(obj1), ...Object.keys(obj2)])
  .sort();

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
  if (_.has(obj1, key) && _.has(obj2, key)) {
    if (_.isEqual(value1, value2)) {
      return {
        key,
        type: CHANGE_TYPES.unchanged,
        value: value1,
        children: [],
      };
    }
    return [{
      key,
      type: CHANGE_TYPES.removed,
      value: value1,
      children: [],
    },
    {
      key,
      type: CHANGE_TYPES.added,
      value: value2,
      children: [],
    }];
  }
  if (_.has(obj1, key)) {
    return {
      key,
      type: CHANGE_TYPES.removed,
      value: value1,
      children: [],
    };
  }
  return {
    key,
    type: CHANGE_TYPES.added,
    value: value2,
    children: [],
  };
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = parse(filepath1);
  const obj2 = parse(filepath2);
  const diff = getSortedObjectsKeys(obj1, obj2)
    .flatMap((newKey) => makeKeyDiff(obj1, obj2, newKey));
  if (format === 'stylish') {
    return formatToStylish(diff, 1);
  }
  return '';
};

export default genDiff;
