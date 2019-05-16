/**
 * @fileoverview PluginError Exception
 *
 */

'use strict';

const messages = require('../messages');

class PluginError extends Error {
  constructor(message, pluginName, error) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, PluginError);

    this.messageTemplate = messages.pluginIssue;
    this.data = { pluginName, error };
  }
}

module.exports = PluginError;
