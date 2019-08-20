/**
 * @fileoverview Adviser Plugin Template.
 *
 */

const metadata = require('./plugin-metadata');

/**
 * All the plugin defitions may extend from this class
 *
 * @class Plugin
 */
class Plugin {
  /**
   * Called when the plugin is parsed by the engine
   * @param {Object} settings - The plugin settings if was defined in the config files
   */
  constructor(settings) {
    this.settings = settings;
  }

  /**
   * Plugin hook called before the engine runs all the rules
   *
   * @param {Object} context - plugin name, rules id, rules severity, rules options
   */
  preRulesExecution(context) {
    this.context = context;
  }

  /**
   * Plugin hook called after the engine runs all the rule
   *
   * @param {Object} summary - plugin name, rules id, rules severity, rules execution status, rules execution duration
   */
  postRulesExecution(summary) {
    this.summary = summary;
  }
}

Plugin.meta = { ...metadata };

module.exports = Plugin;
