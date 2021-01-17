import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const getPhrase = (type, value) => {
  switch (type) {
    case 'added':
      return `added with value: ${formatValue(value)}`;
    case 'removed':
      return 'removed';
    case 'updated':
      return `updated. From ${formatValue(value.value1)} to ${formatValue(value.value2)}`;
    default:
      return null;
  }
};

const buildPath = (path, newElem) => `${path}${newElem}.`;

const formatToPlain = (tree) => {
  const iter = (currentTree, path) => currentTree.flatMap(({
    type, value, key, children,
  }) => {
    const currentPath = buildPath(path, key);
    if (children.length > 0) {
      return iter(children, currentPath);
    }
    if (type === 'unchanged') {
      return null;
    }
    const phrase = getPhrase(type, value);
    return `Property '${currentPath.slice(0, -1)}' was ${phrase}`;
  });

  return iter(tree, '')
    .filter((el) => el !== null)
    .join('\n');
};

export default formatToPlain;
