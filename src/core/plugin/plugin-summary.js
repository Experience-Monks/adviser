/**
 * @fileoverview Plugin summary.
 *
 */

'use strict';

/**
 * Plugin summary object for external plugins
 *
 * @class PluginSummary
 */
class PluginSummary {
  constructor(pluginName, rules) {
    this.pluginName = pluginName;
    this.rules = rules;

    Object.freeze(this);
  }
}

module.exports = PluginSummary;
