/**
 * @fileoverview Plugin context.
 *
 */

'use strict';

/**
 * Plugin context object for external plugins
 *
 * @class RuleContext
 */
class PluginContext {
  constructor(pluginName, rules) {
    this.pluginName = pluginName;

    this.rules = rules.map(rule => {
      return { id: rule.id, severity: rule.severity, options: rule.options };
    });
  }
}

module.exports = PluginContext;
