/**
 * @fileoverview ConfigFileValidation Exception
 *
 */

'use strict';

const messages = require('../messages/messages-enum');

/**
 * Sentinal Configuration File Validation Exception
 *
 * @class ConfigFileValidationError
 * @extends {Error}
 */
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
