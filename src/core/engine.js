/**
 * @fileoverview Sentinal engine core
 *
 */

'use strict';

const debug = require('debug')('sentinal:engine');
const async = require('async');

const logger = require('../utils/logger');
const defaultOptions = require('./default-engine-options');

const plugins = require('./config/plugins');
const rules = require('./config/rules');

const RuleLifeCycle = require('./lifecycle/rule-lifecycle');
const RuleContext = require('./lifecycle/rule-context');
const RuleSandbox = require('./lifecycle/rule-sandbox');
const RuleFeedback = require('./lifecycle/rule-feedback');
const RuleStatus = require('./lifecycle/rule-status');

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
    async.each(
      this.rules.getAll(),
      (rule, callback) => {
        this._ruleLifecyclePipeline(rule, callback);
      },
      error => {
        if (error) {
          logger.error('Some rules has failed the run');
        } else {
          this.printResults();
        }
      }
    );
  }

  async _ruleLifecyclePipeline(rule, callback) {
    let instanceRule = null;
    let phase = RuleLifeCycle.Init;
    const instanceContext = new RuleContext(
      rule.ruleId,
      rule.pluginName,
      this.options.cwd,
      null,
      rule.settings.options,
      rule.settings.severity
    );

    try {
      // 1. Init rules
      const DefinedRule = rule.code;
      instanceRule = new DefinedRule(instanceContext);

      // 2. Run the rule
      phase = RuleLifeCycle.Run;
      const sandbox = new RuleSandbox(this.report.bind(this), instanceContext);
      await instanceRule.run(sandbox);

      // 3. Rule Execution Ended
      phase = RuleLifeCycle.ruleExecutionEnded;
      const feedback = new RuleFeedback(RuleStatus.Completed, phase);
      instanceRule.ruleExecutionEnded(feedback);
    } catch (error) {
      const feedback = new RuleFeedback(RuleStatus.Failed, phase);
      instanceRule.ruleExecutionFailed(feedback, error);
    } finally {
      callback();
    }
  }

  report(ruleReport) {
    this._rawIssues.push({ params: ruleReport.params, ...ruleReport.context });
  }

  _loadRules() {
    // Load the plugins
    this.plugins.loadAll(this.config.getPlugins(), this.options.cwd);

    // Load the rules
    const configRules = this.config.getRules();
    Object.keys(configRules).forEach(fullRuleName => {
      const pluginName = this._getPluginNameFromRule(fullRuleName);
      const ruleName = this._getRuleNameFromRule(fullRuleName);

      const plugin = this.plugins.get(pluginName);

      if (plugin && plugin.rules) {
        const rule = plugin.rules[ruleName];
        const ruleSettings = configRules[fullRuleName];

        this.rules.add(fullRuleName, rule, ruleSettings, pluginName);
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
}

module.exports = Engine;
