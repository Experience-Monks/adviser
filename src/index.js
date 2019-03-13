/**
 * Print {strings and number} messages in the console
 *
 * @param {String | Number} message
 */
function print(message) {
  var _message = message !== undefined ? message : '';

  if (!_isString(message) && !_isNumber(message)) {
    throw new Error('The argument is not a string or a number');
  }

  console.log(_message);
}

/**
 * Verify if the passed value is a String
 *
 * @param {*} value
 * @returns {Boolean}
 */
function _isString(value) {
  return toString.call(value) == '[object String]';
}

/**
 * Verify if the passed value is a Number
 *
 * @param {*} value
 * @returns {Boolean}
 */
function _isNumber(value) {
  return typeof value === 'number';
}

module.exports = print;
