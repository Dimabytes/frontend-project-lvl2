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
      return `updated. From ${formatValue(value.oldValue)} to ${formatValue(value.newValue)}`;
    default:
      return null;
  }
};

const buildPath = (path, newElem) => `${path}${newElem}.`;

function findPaths(tree) {
  const iter = ({
    type, value, key, children,
  }, currentPath) => {
    if (children.length === 0) {
      return {
        value,
        type,
        path: buildPath(currentPath, key).slice(0, -1),
      };
    }
    return children
      .flatMap((child) => iter(child, buildPath(currentPath, key)));
  };
  return tree.flatMap((child) => iter(child, ''));
}

const formatToOutput = (tree) => tree.map(({
  type, value, path,
}) => {
  const phrase = getPhrase(type, value);
  return `Property '${path}' was ${phrase}`;
}).join('\n');

const formatToPlain = (tree) => {
  const formattedTree = findPaths(tree).filter((el) => el.type !== 'unchanged');
  return formatToOutput(formattedTree);
};

export default formatToPlain;
