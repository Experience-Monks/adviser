/**
 * @fileoverview Adviser engine core
 *
 */

'use strict';

const path = require('path');
const debug = require('debug')('adviser:engine');
const async = require('async');
const requireIndex = require('requireindex');

const defaultOptions = require('./default-engine-options');
const { BUILT_IN_NAME } = require('./constants/plugins');

const plugins = require('./config/plugins');
const rules = require('./config/rules');

const InvalidRuleError = require('./errors/exceptions/invalid-rule-error');

/**
 * Adviser core engine, it runs the loaded rules
 *
 * @class Engine
 */
class Engine {
  /**
   *Creates an instance of Engine.
   * @param {Config} configInstance
   * @param {Object} engine options
   * @memberof Engine
   */
  constructor(configInstance, options) {
    debug('Running engine');

    this.options = Object.assign({}, defaultOptions, options);
    this.config = configInstance;

    this.plugins = plugins;
    this.rules = rules;

    this._loadBuiltInRules();
    this._loadRules();

    this._rawIssues = [];
  }

  /**
   * Run all the rules lifecycle
   *
   * @memberof Engine
   */
  run() {
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
    this.plugins.loadAll(this.config.getPlugins(), this.options.cwd);

    const configRules = this.config.getRules();

    Object.keys(configRules).forEach(fullRuleName => {
      const ruleSettings = configRules[fullRuleName];

      if (this.builtInRules[fullRuleName]) {
        this.rules.add(fullRuleName, BUILT_IN_NAME, this.builtInRules[fullRuleName], ruleSettings);
      } else {
        const { pluginName, ruleName } = this._parseRawRuleName(fullRuleName);

        const plugin = this.plugins.get(pluginName);

        if (plugin && plugin.rules) {
          const ruleCore = plugin.rules[ruleName];

          if (!ruleCore) {
            throw new InvalidRuleError(
              'Invalid rule definition',
              ruleName,
              `The rule ${ruleName} is not defined or not well defined inside the plugin ${pluginName}`
            );
          }

          this.rules.add(ruleName, pluginName, ruleCore, ruleSettings);
        } else {
          throw new InvalidRuleError(
            'Invalid rule structure',
            ruleName,
            `Invalid Rule structure, seems the rule doesn't exist or there are issues in the rule's source-code, please review the plugin structure`
          );
        }
      }
    });
  }

  /**
   * Load Adviser built-in rules
   *
   * @memberof Engine
   */
  _loadBuiltInRules() {
    this.builtInRules = requireIndex(path.join(__dirname, '/built-in/rules'));
  }

  /**
   * Parse raw rule from the configuration file
   *
   * @param {String} rule
   * @returns {Object} {pluginName, ruleName}
   * @memberof Engine
   */
  _parseRawRuleName(rule) {
    const rulePluginTuple = rule.split('/');
    if (rulePluginTuple.length !== 2) {
      throw new InvalidRuleError(
        'Invalid rule name',
        rule,
        'Invalid Rule name, make sure it follows the format [plugin name]/[rule name]'
      );
    }

    return {
      pluginName: rulePluginTuple[0],
      ruleName: rulePluginTuple[1]
    };
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
