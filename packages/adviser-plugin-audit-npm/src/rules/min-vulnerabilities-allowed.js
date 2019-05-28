'use strict';

const Adviser = require('adviser');

class MinVulnerabilityAllowed extends Adviser.Rule {
  constructor(context) {
    console.log(context);
  }

  run(sandbox) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        sandbox.report({ message: 'lalalalalalal' });
        resolve();
      }, 3000);
    });
  }

  ruleExecutionFailed(feedback, error) {
    console.log(feedback);
  }

  ruleExecutionEnded(feedback) {
    console.log(feedback);
  }
}

MinVulnerabilityAllowed.meta = {
  category: 'Vulnerabilities',
  description: 'To be fill',
  recommended: true,
  docsUrl: 'https://github..com/jam3/',
  schema: {
    enum: ['low', 'moderate', 'high', 'critical']
  }
};

module.exports = MinVulnerabilityAllowed;
