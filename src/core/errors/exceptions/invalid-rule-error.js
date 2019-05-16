/**
 * @fileoverview InvalidRule Exception
 *
 */

'use strict';

const messages = require('../messages');

class InvalidRuleError extends Error {
  constructor(message, ruleName, error) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, InvalidRuleError);

    this.messageTemplate = messages.invalidRule;
    this.data = { ruleName, error };
  }
}

module.exports = InvalidRuleError;
