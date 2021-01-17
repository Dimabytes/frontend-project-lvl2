import _ from 'lodash';

const makeDiff = (obj1, obj2) => {
  const keys = _([...Object.keys(obj1), ...Object.keys(obj2)])
    .uniq().sortBy().value();
  return keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!_.has(obj1, key)) {
      return {
        key, type: 'added', value: value2, children: [],
      };
    } if (!_.has(obj2, key)) {
      return {
        key, type: 'removed', value: value1, children: [],
      };
    } if (_.isObject(value1) && _.isObject(value2)) {
      return {
        key, type: 'unchanged', value: null, children: makeDiff(value1, value2),
      };
    } if (!_.isEqual(value1, value2)) {
      return {
        key, type: 'updated', value: { value1, value2 }, children: [],
      };
    }
    return {
      key, type: 'unchanged', value: value1, children: [],
    };
  });
};

export default makeDiff;
