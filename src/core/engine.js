/**
 * @fileoverview Sentinal engine core
 *
 */

'use strict';

const debug = require('debug')('sentinal:engine');

const logger = require('../utils/logger');
const defaultOptions = require('./default-engine-options');

const plugins = require('./config/plugins');
const rules = require('./config/rules');

const InvalidRuleError = require('./errors/exceptions/invalid-rule-error');

class Engine {
  constructor(configInstance, options) {
    debug('Running engine');

    this.options = Object.assign({}, defaultOptions, options);
    this.config = configInstance;

    this.plugins = plugins;
    this.rules = rules;

    this._loadRules();

    this._rawIssues = [];
  }

  run() {
    // TODO: Make it running in parallel
    this.config.rules.getAll().forEach(rule => {
      // TODO: Define a better structure sandbox (ruleContext)
      const ruleContext = {
        options: rule.settings,
        dirname: this.options.cwd,
        report: params => {
          const context = {
            pluginName: 'audit-npm',
            severity: this.normalizeSeverity(rule.settings.severity),
            ruleName: 'min-vulnerabilities-allowed',
            params
          };
          this.processRuleOutput(context);
        }
      };
      rule.create(ruleContext);
    });

    this.printResults();
  }

  _loadRules() {
    // Load the plugins
    this.plugins.loadAll(this.config.getPlugins(), this.options.cwd);

    // Load the rules
    const configRules = this.config.getRules();
    Object.keys(configRules).forEach(ruleName => {
      const pluginName = this._getPluginNameFromRule(ruleName);

      const plugin = this.plugins.get(pluginName);

      if (plugin && plugin.rules) {
        const rule = plugin.rules[ruleName];
        const ruleSettings = configRules[ruleName];
        this.rules.add(ruleName, rule, ruleSettings);
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

  processRuleOutput(context) {
    this._rawIssues.push(context);
  }

  getFormatter(formatName) {
    const formatterPath = `./formatters/${formatName}`;

    try {
      return require(formatterPath);
    } catch (ex) {
      throw new Error(`There was a problem loading formatter: ${formatterPath}\nError: ${ex.message}`);
    }
  }

  printResults() {
    const formatter = this.getFormatter(this.options.outputFormat);

    const output = formatter(this._rawIssues);

    if (output) {
      logger.info(output);
    }
  }

  normalizeSeverity(severity) {
    if ((severity === 'error') | 2) {
      return 'error';
    }

    if ((severity === 'warn') | 1) {
      return 'warn';
    }

    return 'off';
  }
}

module.exports = Engine;
