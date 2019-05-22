/**
 * @fileoverview Entry point for NodeJS use
 *
 */

'use strict';

const rule = require('./core/plugins/rule');

module.exports = {
  /**
   * Parent class for rules defined in plugins
   */
  Rule: rule
};
