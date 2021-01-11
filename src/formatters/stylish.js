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

const formatUpdatedDiff = ({ value, children, key }) => {
  const { oldValue, newValue } = value;
  return [
    {
      key,
      children,
      value: oldValue,
      type: 'removed',
    },
    {
      key,
      children,
      value: newValue,
      type: 'added',
    },
  ];
};

const preFormat = (tree) => tree.flatMap(({
  value, children, key, type,
}) => {
  if (type === 'updated') {
    return preFormat(formatUpdatedDiff({
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

const formatToOutput = (tree, level) => {
  const innerData = tree.map(({
    type, children, value, key,
  }) => {
    const levelIndent = getLevelIndent(level);
    const sign = getSign(type);
    const outputString = children.length > 0 ? formatToOutput(children, level + 1) : value;
    return `${levelIndent}${sign}${key}: ${outputString}`;
  }).join('\n');
  const closeLevelIndent = getCloseLevelIndent(level);
  return `{\n${innerData}\n${closeLevelIndent}}`;
};

const formatToStylish = (tree) => {
  const preFormattedTree = preFormat(tree);
  return formatToOutput(preFormattedTree, 1);
};

export default formatToStylish;
