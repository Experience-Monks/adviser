/**
 * @fileoverview Group by native implementation
 *
 */

'use strict';

/**
 * Creates an object composed of keys generated from the `key` of each element
 * in the collection. The value is an array of elements that generated that `key`
 * @param {traversable} traversable An array like collection
 * @param {string} key A arraykey for the grouping
 * @returns {string} A composed object
 */
function groupBy(traversable, key) {
  const result = {};

  Array.from(traversable).forEach((val) => {
    const elementKey = val[key];

    if (!Object.prototype.hasOwnProperty.call(result, elementKey)) {
      result[elementKey] = [];
    }

    result[elementKey].push(val);
  });
  return result;
}

module.exports = groupBy;
