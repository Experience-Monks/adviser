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
    super(context);
  }

  /**
   * Action rule method called when the engine runs the rule
   *
   * @param {Object} sandbox - report method, libraries abstraction
   * @memberof MinVulnerabilityAllowed
   */
  run(sandbox) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        sandbox.report({ message: 'lalalalalalal' });
        resolve();
      }, 3000);
    });
  }

  /**
   * The rule has being stopped by the engine
   *
   * @param {Object} feedback - timing, status (killed), detail
   * @memberof MinVulnerabilityAllowed
   */
  ruleExecutionKilled(feedback) {}
}

MinVulnerabilityAllowed.meta = {
  category: 'Vulnerabilities',
  description: 'To be fill',
  recommended: true,
  docsUrl: docsUrl('min-vulnerabilities-allowed'),
  schema: {
    enum: ['low', 'moderate', 'high', 'critical']
  }
};

module.exports = MinVulnerabilityAllowed;
