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
  constructor(pluginName, dirname, rules) {
    this.pluginName = pluginName;
    this.rules = rules;
    this.filesystem = {
      dirname
    };

    Object.freeze(this);
  }
}

module.exports = PluginSummary;
