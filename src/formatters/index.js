import formatToStylish from './stylish.js';
import formatToPlain from './plain.js';
import formatToJson from './json.js';

const format = (data, formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatToStylish(data);
    case 'plain':
      return formatToPlain(data);
    case 'json':
      return formatToJson(data);
    default:
      throw new Error(`Unknown output format ${formatName}`);
  }
};

export default format;
