'use strict';

const Sentinal = require('sentinal');

const docsUrl = require('../utils/docsUrl');

class MinVulnerabilityAllowed extends Sentinal.Rule {
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
