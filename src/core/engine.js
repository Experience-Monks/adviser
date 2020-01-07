/**
 * @fileoverview Adviser engine core
 *
 */

'use strict';

const path = require('path');
const EventEmitter = require('events');

const debug = require('debug')('adviser:engine');
const async = require('async');
const requireIndex = require('requireindex');

const defaultOptions = require('./default-engine-options');
const EVENTS = require('./constants/events');
const { BUILT_IN_NAME } = require('./constants/plugins');

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

    this._loadBuiltInRules();
    this._loadPlugins();
    this._loadRules();

    this._rawIssues = [];
  }

  /**
   * Run rules lifecycles and plugins hooks
   *
   * @memberof Engine
   */
  async run() {
    this.emit(EVENTS.ENGINE.RUN);

    let plugins = {};
    let rules = this.rules.getAll();

    if (this.options.tags) {
      const settingTags = this.config.getTags();
      rules = this.rules.getByTag(this.options.tags, settingTags);

      const pluginNames = Object.keys(this.plugins.getAll()).map(pluginName => {
        return {
          id: this.plugins.get(pluginName).id,
          name: pluginName
        };
      });

      rules.forEach(rule => {
        const plugin = pluginNames.find(pluginName => pluginName.id === rule.pluginName);
        if (plugin) {
          plugins[plugin.name] = this.plugins.get(plugin.id);
        }
      });
    } else {
      plugins = this.plugins.getAll();
    }

    await this.runPluginsPreHook(plugins);
    await this.runRules(rules);
    await this.runPluginsPostHook(plugins);
    this.emit(EVENTS.ENGINE.STOP);
  }

  /**
   * Run plugins pre-hooks
   *
   * @returns
   * @memberof Engine
   */
  runPluginsPreHook(plugins) {
    return new Promise((resolve, reject) => {
      async.each(
        plugins,
        (plugin, callback) => {
          plugin.preRunHook(this.options.cwd, callback);
        },
        error => {
          if (error) {
            reject(error);
          } else {
            debug(`Finished running all the plugin's pre hooks`);
            resolve();
          }
        }
      );
    });
  }

  /**
   * Run all the rules lifecycle
   *
   * @memberof Engine
   */
  runRules(rules) {
    return new Promise((resolve, reject) => {
      async.each(
        rules,
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
   * Run plugins post-hooks
   *
   * @returns
   * @memberof Engine
   */
  runPluginsPostHook(plugins) {
    return new Promise((resolve, reject) => {
      async.each(
        plugins,
        (plugin, callback) => {
          plugin.postRunHook(this.options.cwd, callback);
        },
        error => {
          if (error) {
            reject(error);
          } else {
            debug(`Finished running all the plugin's post hooks`);
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
   * Load plugins from the config file
   *
   * @memberof Engine
   */
  _loadPlugins() {
    this.plugins.loadAll(this.config.getPlugins(), this.options.cwd);
  }

  /**
   * Load rules from the config file and from the plugins
   *
   * @memberof Engine
   */
  _loadRules() {
    this.emit(EVENTS.ENGINE.LOAD_RULES);

    const configRules = this.config.getRules();

    Object.keys(configRules).forEach(fullRuleName => {
      const ruleSettings = configRules[fullRuleName];

      if (this.builtInRules[fullRuleName]) {
        this.rules.add(fullRuleName, fullRuleName, BUILT_IN_NAME, this.builtInRules[fullRuleName], ruleSettings);
      } else {
        const { pluginName, ruleName } = this._parseRawRuleName(fullRuleName);

        const plugin = this.plugins.get(pluginName);

        if (plugin && plugin.definedRules) {
          const ruleCore = plugin.definedRules[ruleName];

          if (!ruleCore) {
            throw new InvalidRuleError(
              'Invalid rule definition',
              ruleName,
              `The rule ${ruleName} is not defined or the plugin ${pluginName} is not exporting the rule correctly`
            );
          }

          this.rules.add(ruleName, fullRuleName, pluginName, ruleCore, ruleSettings);
          plugin.addProcesedRule(this.rules.get(ruleName));
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
