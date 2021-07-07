/**
 * @fileoverview Wrapper for native console
 *
 */

'use strict';

function _log(method = 'log', ...args) {
  // eslint-disable-next-line
  console[method](...args);
}

module.exports = {
  /**
   * Same functionality than console.log
   * @param {*} message
   * @returns {void}
   */
  info(...args) {
    _log('log', ...args);
  },

  /**
   * Same functionality than console.error
   * @param {*} message
   * @returns {void}
   */
  error(...args) {
    _log('error', ...args);
  },

  /**
   * Same functionality than console.warn
   * @param {*} message
   * @returns {void}
   */
  warn(...args) {
    _log('warn', ...args);
  },
};
