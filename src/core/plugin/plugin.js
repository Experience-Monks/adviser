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

    // Instantiate the plugin if using the new architecture, or fallback to object support
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
  async preRunHook(asyncCallback) {
    if (!this.core.preRun) {
      asyncCallback();
      return;
    }

    const contextRules = this.processedRules.map(rule => {
      return { id: rule.id, severity: rule.severity, options: rule.options };
    });
    const context = new PluginContext(this.id, contextRules);

    try {
      await this.core.preRun(context);

      this.processedRules.forEach(rule => {
        rule.addSharedContext(context.shared);
      });
    } catch (error) {
      debug(`The plugin ${this.id} pre-rule execution hook failed with error ${error}`);
    } finally {
      debug(`The engine finished executing the pre-rule execution hook of the plugin ${this.id}`);
      asyncCallback();
    }
  }

  /**
   * Run the plugin post-rules execution hook
   *
   * @param {Function} asyncCallback
   * @returns
   * @memberof Plugin
   */
  async postRunHook(asyncCallback) {
    if (!this.core.postRun) {
      asyncCallback();
      return;
    }

    const summaryRules = this.processedRules.map(rule => {
      return {
        id: rule.id,
        severity: rule.severity,
        status: rule.lifeCycleStatus,
        duration: rule.executionDuration
      };
    });
    const summary = new PluginSummary(this.id, summaryRules);

    try {
      await this.core.postRun(summary);
    } catch (error) {
      debug(`The plugin ${this.id} post-rule execution hook failed with error ${error}`);
    } finally {
      debug(`The engine finished executing the post-rule execution hook of the plugin ${this.id}`);
      asyncCallback();
    }
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
