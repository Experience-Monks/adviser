/**
 * @fileoverview Adviser Rule Template.
 *
 */

const metadata = require('./rule-metadata');

/**
 * All the rule defitions within plugins should extend from this class
 *
 * @class Rule
 */
class Rule {
  /**
   * Called when the rule is parsed by the engine
   * @param {Object} context - dirname, filename, options, ruleId
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Action rule method called when the engine runs the rule
   *
   * @param {Object} sandbox - report method, libraries abstraction
   */
  run(sandbox) {
    this.sandbox = sandbox;
  }

  /**
   * The rule execution failed
   *
   * @param {Object} feedback - timing, status (failed)
   * @param {Object} error - Error Object if exists
   */
  ruleExecutionFailed(feedback, error) {
    this.feedback = feedback;
  }

  /**
   * The rule execution finished
   *
   * @param {Object} feedback - timing, status (completed)
   * @param {Object} error - Error Object if exists
   */
  ruleExecutionEnded(feedback) {
    this.feedback = feedback;
  }
}

Rule.meta = { ...metadata };

module.exports = Rule;
