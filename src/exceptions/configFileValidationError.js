/**
 * @fileoverview ConfigFileValidation Exception
 *
 */

'use strict';

const messages = require('./messages');

class ConfigFileValidationError extends Error {
  constructor(message, path, errors) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, ConfigFileValidationError);

    this.messageTemplate = messages.configFileValidation;
    this.data = { path, errors };
  }
}

module.exports = ConfigFileValidationError;
