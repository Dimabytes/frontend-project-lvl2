import formatToStylish from './stylish';

const getFormatter = (format) => {
  if (format === 'stylish') {
    return formatToStylish;
  } if (format === 'plain') {
    return null;
  }
  return null;
};

export default getFormatter;
