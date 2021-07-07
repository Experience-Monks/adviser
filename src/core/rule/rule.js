/**
 * @fileoverview Adviser Rules.
 *
 */

'use strict';

const { PerformanceObserver, performance } = require('perf_hooks');

const debug = require('debug')('adviser:rule');

const RuleLifeCycleEnum = require('./lifecycle/rule-lifecycle-enum');
const RuleContext = require('./lifecycle/rule-context');
const RuleSandbox = require('./lifecycle/rule-sandbox');
const RuleFeedback = require('./lifecycle/rule-feedback');
const RuleStatusEnum = require('./lifecycle/rule-status-enum');
const SeverityEnum = require('../config/severity-enum');

/**
 * Wrap individual rules in the core
 *
 * @class Rule
 */
class Rule {
  constructor(id, fullRuleName, pluginName, core, severity, options) {
    this.id = id.toLowerCase();
    this.fullRuleName = fullRuleName;
    this.pluginName = pluginName.toLowerCase();

    this.sharedContext = null;

    this.severity = severity;
    this.options = options;

    this.core = core;

    this.lifeCycleStatus = severity === SeverityEnum.Off ? RuleStatusEnum.Skipped : RuleStatusEnum.Idle;

    this._setupTiming();
  }

  /**
   * Setup execution performance timers
   *
   * @memberof Rule
   */
  _setupTiming() {
    const obs = new PerformanceObserver(items => {
      const performanceEntry = items.getEntriesByName(this.id);

      if (performanceEntry[0]) {
        this.executionDuration = performanceEntry[0].duration;
      }
      performance.clearMarks();
    });
    obs.observe({ entryTypes: ['measure'] });
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
   * Add to the rule data that will be included in the context.
   *
   * @param {Object} sharedContext
   * @memberof Rule
   */
  addSharedContext(sharedContext) {
    this.sharedContext = sharedContext;
  }

  /**
   * Run the rule lifecycle
   *
   * @param {Path} currentDirectory
   * @param {Function} reportCallback Engine report callback
   * @param {Function} asyncCallback Callback to be called once the execution is finished
   * @memberof Rule
   */
  async runLifeCycle(currentDirectory, verboseMode, reportCallback, asyncCallback) {
    if (this.severity === SeverityEnum.Off) {
      asyncCallback();
      return;
    }

    performance.mark(`Init lifecycle ${this.id}`);

    let instanceRule = null;
    let phase = RuleLifeCycleEnum.Init;

    const instanceContext = new RuleContext(
      this.id,
      this.pluginName,
      currentDirectory,
      null,
      this.options,
      this.severity,
      verboseMode,
      this.sharedContext
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
        if (instanceRule !== null) {
          instanceRule.ruleExecutionFailed(feedback, error);
        }
      } catch (executionFailedError) {
        debug(`The "ruleExecutionFailed" lifecycle failed with error ${executionFailedError}`);
      }
    } finally {
      performance.mark(`Finished lifecycle ${this.id}`);
      performance.measure(`${this.id}`, `Init lifecycle ${this.id}`, `Finished lifecycle ${this.id}`);

      debug(`The engine finished executing the lifecycle of the rule ${this.id}`);
      asyncCallback();
    }
  }
}

module.exports = Rule;
