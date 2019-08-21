/**
 * @fileoverview Adviser engine core
 *
 */

'use strict';

const EventEmitter = require('events');

const debug = require('debug')('adviser:engine');
const async = require('async');

const EVENTS = require('./constants/events');
const defaultOptions = require('./default-engine-options');

const plugins = require('./config/plugins');
const rules = require('./config/rules');

const InvalidRuleError = require('./errors/exceptions/invalid-rule-error');

/**
 * Adviser core engine, it runs the loaded rules
 *
 * @class Engine
 */
class Engine extends EventEmitter {
  /**
   *Creates an instance of Engine.
   * @param {Config} configInstance
   * @param {Object} engine options
   * @memberof Engine
   */
  constructor(configInstance, options) {
    super();

    debug('Running engine');

    this.options = Object.assign({}, defaultOptions, options);
    this.config = configInstance;

    this.plugins = plugins;
    this.rules = rules;

    this._loadRules();

    this._rawIssues = [];
  }

  /**
   * Run all the rules lifecycle
   *
   * @memberof Engine
   */
  run() {
    this.emit(EVENTS.ENGINE.RUN);
    return new Promise((resolve, reject) => {
      async.each(
        this.rules.getAll(),
        (rule, callback) => {
          rule.runLifeCycle(this.options.cwd, this.options.verboseMode, this.report.bind(this), callback);
        },
        error => {
          if (error) {
            reject(error);
          } else {
            debug(`Finished running all the rules lifecycle`);
            this.emit(EVENTS.ENGINE.STOP);
            resolve();
          }
        }
      );
    });
  }

  /**
   * Send a report to the engine
   *
   * @param {Object} ruleReport
   * @memberof Engine
   */
  report(ruleReport) {
    this._rawIssues.push({
      params: ruleReport.params,
      ruleName: ruleReport.context.ruleName,
      pluginName: ruleReport.context.pluginName,
      severity: ruleReport.context.severity
    });
  }

  /**
   * Load rules from the config file and from the plugins
   *
   * @memberof Engine
   */
  _loadRules() {
    this.emit(EVENTS.ENGINE.LOAD_RULES);

    this.plugins.loadAll(this.config.getPlugins(), this.options.cwd);

    const configRules = this.config.getRules();
    Object.keys(configRules).forEach(fullRuleName => {
      const pluginName = this._getPluginNameFromRule(fullRuleName);
      const ruleName = this._getRuleNameFromRule(fullRuleName);

      const plugin = this.plugins.get(pluginName);

      if (plugin && plugin.rules) {
        const ruleCore = plugin.rules[ruleName];
        const ruleSettings = configRules[fullRuleName];

        this.rules.add(ruleName, pluginName, ruleCore, ruleSettings);
      } else {
        throw new InvalidRuleError(
          'Invalid rule structure',
          ruleName,
          `Invalid Rule structure, seems there are issues in the rule source code, please review the plugin structure`
        );
      }
    });
  }

  _getPluginNameFromRule(rule) {
    const rulePluginTuple = rule.split('/');
    if (rulePluginTuple.length !== 2) {
      throw new InvalidRuleError(
        'Invalid rule name',
        rule,
        'Invalid Rule name, make sure it follows the format [plugin name]/[rule name]'
      );
    }

    return rulePluginTuple[0];
  }

  _getRuleNameFromRule(rule) {
    const rulePluginTuple = rule.split('/');
    if (rulePluginTuple.length !== 2) {
      throw new InvalidRuleError(
        'Invalid rule name',
        rule,
        'Invalid Rule name, make sure it follows the format [plugin name]/[rule name]'
      );
    }

    return rulePluginTuple[1];
  }

  /**
   * Get list of found issues <warning and errors>
   *
   * @returns
   * @memberof Engine
   */
  getIssues() {
    let warningCount = 0;
    let errorCount = 0;

    this._rawIssues.forEach(issue => {
      errorCount = issue.severity === 'error' ? errorCount + 1 : errorCount;
      warningCount = issue.severity === 'warn' ? warningCount + 1 : warningCount;
    });

    return {
      items: this._rawIssues,
      total: {
        warnings: warningCount,
        errors: errorCount
      }
    };
  }

  /**
   * Get list of processed rules
   *
   * @returns
   * @memberof Engine
   */
  getRules() {
    return this.rules.getAll();
  }
}

module.exports = Engine;
