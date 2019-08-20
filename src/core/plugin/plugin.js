/**
 * @fileoverview Adviser Plugin.
 *
 */

'use strict';

const debug = require('debug')('adviser:plugin');

const PluginTemplate = require('../external/plugin');
const PluginContext = require('./plugin-context');
const PluginSummary = require('./plugin-summary');

/**
 * Wrap individual plugins in the core
 *
 * @class Plugin
 */
class Plugin {
  /**
   *Creates an instance of Plugin.
   * @param {String} id
   * @param {Object} settings
   * @param {Class} Core
   * @memberof Plugin
   */
  constructor(id, settings, Core) {
    this.processedRules = [];
    this.id = id.toLowerCase();
    this.settings = settings;

    if (Core.prototype instanceof PluginTemplate) {
      this.core = new Core(settings);
    } else {
      this.core = Core;
    }

    this.definedRules = this.core.rules;

    debug(`Plugin ${id} created`);
  }

  /**
   * Run the plugin pre-rules execution hook
   *
   * @param {Function} asyncCallback
   * @returns
   * @memberof Plugin
   */
  async runPreRulesExecutionHook(asyncCallback) {
    if (!this.core.preRulesExecutionHook) {
      asyncCallback();
      return;
    }

    const context = new PluginContext(this.id, this.processedRules);
    await this.core.preRulesExecutionHook(context);
    asyncCallback();
  }

  /**
   * Run the plugin post-rules execution hook
   *
   * @param {Function} asyncCallback
   * @returns
   * @memberof Plugin
   */
  async runPostRulesExecutionHook(asyncCallback) {
    if (!this.core.postRulesExecutionHook) {
      asyncCallback();
      return;
    }

    const summary = new PluginSummary(this.id, this.processedRules);
    await this.core.postRulesExecutionHook(summary);
    asyncCallback();
  }

  /**
   * Add a processed rule to the plugin
   *
   * @param {Rule} rule
   * @memberof Plugin
   */
  addProcesedRule(rule) {
    this.processedRules.push(rule);
  }
}

module.exports = Plugin;
