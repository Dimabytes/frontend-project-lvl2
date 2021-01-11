import formatToStylish from './stylish.js';
import formatToPlain from './plain.js';
import formatToJson from './json.js';

const getFormatter = (format) => {
  switch (format) {
    case 'stylish':
      return formatToStylish;
    case 'plain':
      return formatToPlain;
    case 'json':
      return formatToJson;
    default:
      throw new Error('Unknown output format');
  }
};

export default getFormatter;
