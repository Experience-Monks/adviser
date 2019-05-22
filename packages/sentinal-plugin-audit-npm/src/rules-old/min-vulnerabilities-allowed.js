'use strict';

// const exec = require('child_process').exec;

const docsUrl = require('../utils/docsUrl');

// const fakeContext = {
//   dirname: '/Users/iranreyesfleitas/Work/intern-sentinal/packages/sentinal-plugin-audit-npm/tests/example-package',
//   filename: 'package.json',
//   options: {}, // Options set in the rule in the global file
//   id: '', // rule ID
//   report: descriptor => {
//     const descriptorShape = {
//       message: ''
//     };
//   }
// };

module.exports = {
  meta: {
    docs: {
      category: 'Vulnerabilities',
      description: 'To be fill',
      recommended: true,
      url: docsUrl('min-vulnerabilities-allowed')
    },
    schema: {
      enum: ['low', 'moderate', 'high', 'critical']
    }
  },
  create: function(context) {
    // console.log('Rule min-vulnerabilities-allowed called');
    // exec(`npm run audit -- -d ${context.dirname}`, function(err, stdout, stderr) {
    //   if (err) {
    //     console.log('Error', err);
    //   }
    //   console.log(stdout);
    // });
    context.report({
      message: `Rule min-vulnerabilities-allowed called with options ${JSON.stringify(context.options)}`
    });
  }
};
