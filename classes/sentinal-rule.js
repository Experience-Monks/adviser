class Rule {
  /**
   * Called when the rule is parsed by the engine
   * @param {Object} context - dirname, filename, options, ruleId
   * @memberof MinVulnerabilityAllowed
   */
  constructor(context) {
    this.context = context;
    console.log('Rule::constructor', context.ruleName);
  }

  /**
   * The rule is added to the run pipeline
   *
   * @memberof MinVulnerabilityAllowed
   */
  ruleAdded() {
    console.log('Rule::ruleAdded', this.context.ruleName);
  }

  /**
   * Action rule method called when the engine runs the rule
   *
   * @param {Object} sandbox - report method, libraries abstraction
   * @memberof MinVulnerabilityAllowed
   */
  run(sandbox) {
    this.sandbox = sandbox;
    console.log('Rule::run', this.context.ruleName);
  }

  /**
   * The rule execution failed
   *
   * @param {Object} feedback - timing, status (failed)
   * @param {Object} error - Error Object if exists
   * @memberof MinVulnerabilityAllowed
   */
  ruleExecutionFailed(feedback, error) {
    this.feedback = feedback;
    console.log('Rule::ruleExecutionFailed', this.context.ruleName);
  }

  /**
   * The rule execution finished
   *
   * @param {Object} feedback - timing, status (completed)
   * @param {Object} error - Error Object if exists
   * @memberof MinVulnerabilityAllowed
   */
  ruleExecutionEnded(feedback) {
    this.feedback = feedback;
    console.log('Rule::ruleExecutionEnded', this.context.ruleName);
  }
}

Rule.meta = {
  category: '',
  description: '',
  recommended: true,
  docsUrl: '',
  schema: {}
};

module.exports = Rule;
