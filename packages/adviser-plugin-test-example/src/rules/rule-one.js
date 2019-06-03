'use strict';

const Adviser = require('adviser');

class RuleOne extends Adviser.Rule {
  constructor(context) {
    super(context);
    console.log('context', context);
  }

  run(sandbox) {
    console.log('run', sandbox);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        sandbox.report({
          message: 'This is an example of a report that will take 3s',
          verbose: `Verbose message for the plugin:
        1. run it
        2. delete it`
        });
        resolve();
      }, 3000);
    });
  }

  ruleExecutionFailed(feedback, error) {
    console.log('ruleExecutionFailed', feedback, error);
  }

  ruleExecutionEnded(feedback) {
    console.log('ruleExecutionEnded', feedback);
  }
}

RuleOne.meta = {
  category: 'Category',
  description: 'Description',
  recommended: true,
  docsUrl: 'https://github..com/jam3/'
};

module.exports = RuleOne;
