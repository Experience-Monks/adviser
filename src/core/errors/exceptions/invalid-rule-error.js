/**
 * @fileoverview InvalidRule Exception
 *
 */

'use strict';

const MessagesEnum = require('../messages/messages-enum');

/**
 * Adviser Invalid Rule Exception
 *
 * @class InvalidRuleError
 * @extends {Error}
 */
class InvalidRuleError extends Error {
  constructor(message, ruleName, error) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, InvalidRuleError);

    this.messageTemplate = MessagesEnum.invalidRule;
    this.data = { ruleName, error };
  }
}

module.exports = InvalidRuleError;
