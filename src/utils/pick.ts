/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {any[]} keys
 * @returns {Object}
 */
const pick = (object: object, keys: any[]) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
