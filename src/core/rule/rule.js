/**
 * @fileoverview Sentinal Rules.
 *
 */

'use strict';

const RuleLifeCycle = require('./lifecycle/rule-lifecycle');
const RuleContext = require('./lifecycle/rule-context');
const RuleSandbox = require('./lifecycle/rule-sandbox');
const RuleFeedback = require('./lifecycle/rule-feedback');
const RuleStatus = require('./lifecycle/rule-status');

/**
 * Wrap individual rules in the core
 *
 * @class Rule
 */
class Rule {
  constructor(id, pluginName, core, severity, options) {
    this.id = id.toLowerCase();
    this.pluginName = pluginName.toLowerCase();

    this.severity = severity;
    this.options = options;

    this.core = core;
  }

  getPluginScopedRuleId() {
    return `${this.pluginName}/${this.id}`;
  }

  async runLifeCycle(currentDirectory, reportCallback, asyncCallback) {
    let instanceRule = null;
    let phase = RuleLifeCycle.Init;

    const instanceContext = new RuleContext(
      this.id,
      this.pluginName,
      currentDirectory,
      null,
      this.options,
      this.severity
    );

    try {
      // 1. Init rules
      const DefinedRule = this.core;
      instanceRule = new DefinedRule(instanceContext);

      // 2. Run the rule
      phase = RuleLifeCycle.Run;
      const sandbox = new RuleSandbox(reportCallback, instanceContext);
      await instanceRule.run(sandbox);

      // 3. Rule Execution Ended
      phase = RuleLifeCycle.ruleExecutionEnded;
      const feedback = new RuleFeedback(RuleStatus.Completed, phase);
      instanceRule.ruleExecutionEnded(feedback);
    } catch (error) {
      const feedback = new RuleFeedback(RuleStatus.Failed, phase);
      instanceRule.ruleExecutionFailed(feedback, error);
    } finally {
      asyncCallback();
    }
  }
}

module.exports = Rule;
