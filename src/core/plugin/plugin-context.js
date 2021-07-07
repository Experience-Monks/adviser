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
  constructor(pluginName, dirname, rules) {
    this.pluginName = pluginName;
    this.rules = rules;
    this.filesystem = {
      dirname,
    };

    this._shared = {
      items: {},
    };

    Object.freeze(this);
  }

  /**
   * Add data to share with the plugin's rules
   *
   * @param {*} data
   * @memberof PluginContext
   */
  addShareableData(data) {
    this._shared.items = data;
  }

  /**
   * Get data to share with the plugin's rules
   *
   * @param {*} data
   * @memberof PluginContext
   */
  getShareableData() {
    return this._shared.items;
  }
}

module.exports = PluginContext;
