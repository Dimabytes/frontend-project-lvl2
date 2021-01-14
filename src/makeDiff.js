import _ from 'lodash';

const getUniqSortedKeys = (obj1, obj2) => _([...Object.keys(obj1), ...Object.keys(obj2)])
  .uniq().sortBy().value();

const makeDiff = (obj1, obj2) => {
  const keys = getUniqSortedKeys(obj1, obj2);
  return keys.map((key) => {
    const oldValue = obj1[key];
    const newValue = obj2[key];

    if (!_.has(obj1, key)) {
      return {
        key, type: 'added', value: newValue, children: [],
      };
    } if (!_.has(obj2, key)) {
      return {
        key, type: 'removed', value: oldValue, children: [],
      };
    } if (_.isObject(oldValue) && _.isObject(newValue)) {
      return {
        key, type: 'unchanged', value: null, children: makeDiff(oldValue, newValue),
      };
    } if (!_.isEqual(oldValue, newValue)) {
      return {
        key, type: 'updated', value: { oldValue, newValue }, children: [],
      };
    }
    return {
      key, type: 'unchanged', value: oldValue, children: [],
    };
  });
};

export default makeDiff;
