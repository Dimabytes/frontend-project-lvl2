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

const preFormat = (arr) => arr.flatMap(({
  value, children, key, type,
}) => {
  const getChildren = (checkValue) => (_.isObject(checkValue)
    ? preFormat(objectToDiff(checkValue))
    : preFormat(children)
  );
  if (type === 'changed') {
    const { value1, value2 } = value;
    return [
      {
        key,
        type: 'removed',
        value: value1,
        children: getChildren(value1),
      },
      {
        key,
        type: 'added',
        value: value2,
        children: getChildren(value2),
      },
    ];
  }
  return {
    key,
    type,
    value,
    children: getChildren(value),
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
  return `{\n${innerData}\n${getCloseLevelIndent(level)}}`;
};

const formatToStylish = (arr) => {
  const preFormatted = preFormat(arr);
  return outputFormat(preFormatted, 1);
};

export default formatToStylish;
