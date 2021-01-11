import _ from 'lodash';

const getLevelIndent = (level) => ' '.repeat(level * 4 - 2);

const getCloseLevelIndent = (level) => ' '.repeat((level - 1) * 4);

const getSign = (type) => {
  switch (type) {
    case 'added':
      return '+ ';
    case 'removed':
      return '- ';
    case 'unchanged':
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
    type: 'unchanged',
  }));

const formatChangedDiff = ({ value, children, key }) => {
  const { value1, value2 } = value;
  return [
    {
      key,
      children,
      value: value1,
      type: 'removed',
    },
    {
      key,
      children,
      value: value2,
      type: 'added',
    },
  ];
};

const preFormat = (arr) => arr.flatMap(({
  value, children, key, type,
}) => {
  if (type === 'changed') {
    return preFormat(formatChangedDiff({
      value,
      children,
      key,
    }));
  }
  return {
    key,
    type,
    value,
    children: preFormat(_.isObject(value) ? objectToDiff(value) : children),
  };
});

const outputFormat = (arr, level) => {
  const innerData = arr.map(({
    type, children, value, key,
  }) => {
    const levelIndent = getLevelIndent(level);
    const sign = getSign(type);
    const outputString = children.length > 0 ? outputFormat(children, level + 1) : value;
    return `${levelIndent}${sign}${key}: ${outputString}`;
  }).join('\n');
  const closeLevelIndent = getCloseLevelIndent(level);
  return `{\n${innerData}\n${closeLevelIndent}}`;
};

const formatToStylish = (arr) => {
  const preFormatted = preFormat(arr);
  return outputFormat(preFormatted, 1);
};

export default formatToStylish;
