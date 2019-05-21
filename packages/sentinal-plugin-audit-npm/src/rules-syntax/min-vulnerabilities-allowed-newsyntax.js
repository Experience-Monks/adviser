'use strict';

const Sentinal = require('sentinal');

const docsUrl = require('../utils/docsUrl');

// Rule lifecycle
// 1. Constructor (When the rule is parsed)
// 4. ruleExecutionEnded (The execution finished without killing)
// 4. ruleExecutionKilled (The engine killed the execution)

class MinVulnerabilityAllowed extends Sentinal.Rule {
  /**
   * Called when the rule is parsed by the engine
   * @param {Object} context - dirname, filename, options, ruleId
   * @memberof MinVulnerabilityAllowed
   */
  constructor(context) {
    super();
  }

  /**
   * The rule is added to the run pipeline
   *
   * @memberof MinVulnerabilityAllowed
   */
  ruleAdded() {}

  /**
   * Action rule method called when the engine runs the rule
   *
   * @param {Object} sandbox - report method, libraries abstraction
   * @memberof MinVulnerabilityAllowed
   */
  run(sandbox) {
    console.log('Rule runs');
  }

  /**
   * The rule has being stopped by the engine
   *
   * @param {Object} feedback - timing, status (killed), detail
   * @memberof MinVulnerabilityAllowed
   */
  ruleExecutionKilled(feedback) {}

  /**
   * The rule execution finished
   *
   * @param {Object} feedback - timing, status (failed, completed, killed)
   * @param {Object} error - Error Object if exists
   * @memberof MinVulnerabilityAllowed
   */
  ruleExecutionEnded(feedback, error) {}
}

MinVulnerabilityAllowed.meta = {
  category: 'Vulnerabilities',
  description: 'To be fill',
  recommended: true,
  docs: docsUrl('min-vulnerabilities-allowed'),
  schema: {
    enum: ['low', 'moderate', 'high', 'critical']
  }
};

module.exports = MinVulnerabilityAllowed;
