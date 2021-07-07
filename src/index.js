/**
 * @fileoverview Entry point for NodeJS use
 *
 */

'use strict';

const rule = require('./core/external/rule');
const plugin = require('./core/external/plugin');

module.exports = {
  /**
   * Parent class for rules defined in plugins
   */
  Rule: rule,
  Plugin: plugin,
};
