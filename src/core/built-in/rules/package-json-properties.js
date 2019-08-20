'use strict';

const Rule = require('../../plugins/rule');
const docs = require('../../../utils/docs');

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

PackageJsonProperties.meta = {
  category: 'Built-in',
  description: 'Property restrictions over package.json',
  recommended: true,
  docsUrl: docs.getURL('package-json-properties')
};

module.exports = PackageJsonProperties;
