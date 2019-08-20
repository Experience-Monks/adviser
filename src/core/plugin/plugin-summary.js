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

    this.rules = rules.map(rule => {
      return { id: rule.id, severity: rule.severity, status: rule.lifeCycleStatus, duration: rule.executionDuration };
    });
  }
}

module.exports = PluginSummary;
