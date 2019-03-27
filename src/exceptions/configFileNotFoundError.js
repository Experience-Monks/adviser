/**
 * @fileoverview ConfigFileNotFound Exception
 *
 */

'use strict';

const messages = require('./messages');

const DEFAULT_ERROR_MESSAGE = 'No Sentinal configuration found.';

class ConfigNotFoundError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGE, path = null) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, ConfigNotFoundError);

    this.messageTemplate = messages.configFileNotFound;
    this.data = { path };
  }
}

module.exports = ConfigNotFoundError;
