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

const formatToPlain = (tree) => {
  const iter = (currentTree, path) => currentTree.flatMap(({
    type, value, key, children,
  }) => {
    const currentPath = [...path, key];
    const builtPath = currentPath.join('.');
    switch (type) {
      case 'nested':
        return iter(children, currentPath);
      case 'added':
        return `Property '${builtPath}' was added with value: ${formatValue(value)}`;
      case 'removed':
        return `Property '${builtPath}' was removed`;
      case 'updated':
        return `Property '${builtPath}' was updated. From ${formatValue(value.value1)} to ${formatValue(value.value2)}`;
      default:
        return null;
    }
  });

  return iter(tree, [])
    .filter((el) => el !== null)
    .join('\n');
};

export default formatToPlain;
