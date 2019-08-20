'use strict';

const Rule = require('../../plugins/rule');

class PackageJsonProperties extends Rule {
  constructor(context) {
    super();
    console.log('context', context);
  }

  run(sandbox) {
    console.log('sandbox', sandbox);
    sandbox.report({ message: 'hola ' });
  }
}

module.exports = PackageJsonProperties;
