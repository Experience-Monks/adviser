/**
 * @fileoverview Adviser Rules.
 *
 */

'use strict';

const debug = require('debug')('adviser:rule');

const RuleLifeCycleEnum = require('./lifecycle/rule-lifecycle-enum');
const RuleContext = require('./lifecycle/rule-context');
const RuleSandbox = require('./lifecycle/rule-sandbox');
const RuleFeedback = require('./lifecycle/rule-feedback');
const RuleStatusEnum = require('./lifecycle/rule-status-enum');

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

    this.lifeCycleStatus = RuleStatusEnum.Idle;
  }

  /**
   * Get full scoped rule id, ex: [plugin name]/[rule id]
   *
   * @returns
   * @memberof Rule
   */
  getPluginScopedRuleId() {
    return `${this.pluginName}/${this.id}`;
  }

  /**
   * Run the rule lifecycle
   *
   * @param {Path} currentDirectory
   * @param {Function} reportCallback Engine report callback
   * @param {Function} asyncCallback Callback to be called once the execution is finished
   * @memberof Rule
   */
  async runLifeCycle(currentDirectory, reportCallback, asyncCallback) {
    let instanceRule = null;
    let phase = RuleLifeCycleEnum.Init;

    const instanceContext = new RuleContext(
      this.id,
      this.pluginName,
      currentDirectory,
      null,
      this.options,
      this.severity
    );

    try {
      debug(`The engine started executing the lifecycle of the rule ${this.id}`);

      // 1. Init rules
      const DefinedRule = this.core;
      instanceRule = new DefinedRule(instanceContext);

      // 2. Run the rule
      phase = RuleLifeCycleEnum.Run;
      const sandbox = new RuleSandbox(reportCallback, instanceContext);
      await instanceRule.run(sandbox);

      // 3. Rule Execution Ended
      phase = RuleLifeCycleEnum.ruleExecutionEnded;
      const feedback = new RuleFeedback(RuleStatusEnum.Completed, phase);
      instanceRule.ruleExecutionEnded(feedback);
      this.lifeCycleStatus = RuleStatusEnum.Completed;
    } catch (error) {
      debug(`The rule ${this.id} lifecycle failed with error ${error}`);
      this.lifeCycleStatus = RuleStatusEnum.Failed;

      // 4. Rule Execution Failed
      const feedback = new RuleFeedback(RuleStatusEnum.Failed, phase);

      try {
        instanceRule.ruleExecutionFailed(feedback, error);
      } catch (executionFailedError) {
        debug(`The "ruleExecutionFailed" lifecycle failed with error ${executionFailedError}`);
      }
    } finally {
      asyncCallback();
    }
  }
}

module.exports = Rule;
