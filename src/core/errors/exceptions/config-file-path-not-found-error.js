/**
 * @fileoverview ConfigFilePathNotFound Exception
 *
 */

'use strict';

const ConfigFileNotFoundError = require('./config-file-not-found-error');
const messages = require('../messages');

class ConfigFilePathNotFoundError extends ConfigFileNotFoundError {
  constructor(path = null) {
    super(null, path);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, ConfigFilePathNotFoundError);

    this.messageTemplate = messages.configFilePathNotFound;
  }
}

module.exports = ConfigFilePathNotFoundError;
