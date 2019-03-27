/**
 * @fileoverview Wrapper for native console
 *
 */

'use strict';

module.exports = {
  info: message => {
    _log(message);
  },
  trace: message => {
    _log(message, 'trace');
  },
  error: message => {
    _log(message, 'error');
  },
  warn: message => {
    _log(message, 'warn');
  }
};

const _log = (message, method = 'log') => {
  console[method](message);
};
