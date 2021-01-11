import formatToStylish from './stylish.js';
import formatToPlain from './plain.js';

const getFormatter = (format) => {
  if (format === 'stylish') {
    return formatToStylish;
  } if (format === 'plain') {
    return formatToPlain;
  }
  return null;
};

export default getFormatter;
