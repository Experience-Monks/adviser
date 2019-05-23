/**
 * @fileoverview ConfigFileNotFound Exception
 *
 */

'use strict';

const messages = require('../messages/messages-enum');

const DEFAULT_ERROR_MESSAGE = 'No Adviser configuration found.';

/**
 * Adviser Configuration File Not Found Exception
 *
 * @class ConfigNotFoundError
 * @extends {Error}
 */
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
