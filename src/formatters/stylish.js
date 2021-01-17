import _ from 'lodash';

const replacer = ' ';
const spacesCount = 4;
const signSize = 2;

const signs = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};

const stringify = (value, startDepth = 1) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }
    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);
    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(value, startDepth);
};

const formatToStylish = (tree) => {
  const iter = (currentTree, depth) => {
    const indentSize = depth * spacesCount - signSize;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - signSize);

    const lines = currentTree
      .flatMap((child) => {
        if (child.type === 'updated') {
          return [{
            key: child.key, children: [], value: child.value.value1, type: 'removed',
          }, {
            key: child.key, children: [], value: child.value.value2, type: 'added',
          }];
        }
        return child;
      })
      .map(({
        type, children, value, key,
      }) => {
        const outputString = children.length > 0
          ? iter(children, depth + 1)
          : stringify(value, depth + 1);
        return `${currentIndent}${signs[type]}${key}: ${outputString}`;
      });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(tree, 1);
};

export default formatToStylish;
