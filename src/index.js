import _ from 'lodash';
import parse from './parsers.js';

const formatToStylish = (json) => {
  const innerData = Object.keys(json)
    .reduce((acc, key) => [...acc, `${key}: ${json[key]}`], []).join('\n  ');
  return `{\n  ${innerData}\n}`;
};

const genDiff = (filepath1, filepath2) => {
  const json1 = parse(filepath1);
  const json2 = parse(filepath2);
  const json1Keys = Object.keys(json1);
  const json2Keys = Object.keys(json2);

  const newKeys = json2Keys.filter((key) => !json1Keys
    .find((el) => el === key))
    .reduce((acc, key) => {
      acc[`+ ${key}`] = json2[key];
      return acc;
    }, {});

  const diff = json1Keys
    .sort()
    .reduce((acc, key) => {
      if (!_.has(json2, key)) {
        return {
          ...acc,
          [`- ${key}`]: json1[key],
        };
      }
      if (json2[key] === json1[key]) {
        return {
          ...acc,
          [`  ${key}`]: json1[key],
        };
      }
      return {
        ...acc,
        [`- ${key}`]: json1[key],
        [`+ ${key}`]: json2[key],
      };
    }, {});

  return formatToStylish({
    ...diff, ...newKeys,
  });
};

export default genDiff;
