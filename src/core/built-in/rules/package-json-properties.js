'use strict';

const path = require('path');

const Rule = require('../../plugins/rule');
const docs = require('../../../utils/docs');

class PackageJsonProperties extends Rule {
  constructor(context) {
    super(context);

    if (!this.context.options['require-props'] && !this.context.options['not-allowed-props']) {
      throw new Error(`At least one option is required, require-props or not-allowed-props`);
    }

    if (this.context.options['require-props'] && !Array.isArray(this.context.options['require-props'])) {
      throw new Error(`Wrong require-props argument, an array is expected`);
    }

    if (this.context.options['not-allowed-props'] && !Array.isArray(this.context.options['not-allowed-props'])) {
      throw new Error(`Wrong not-allowed-props argument, an array is expected`);
    }
  }

  run(sandbox) {
    const packagejson = this.getPackageJsonPath();

    const requiredProps = this.context.options['require-props'];
    if (requiredProps) {
      for (let index = 0; index < requiredProps.length; index++) {
        const property = requiredProps[index];
        if (packagejson[property] === undefined) {
          sandbox.report({
            message: `package.json is missing the required property "${property}"`
          });
          return;
        }
      }
    }

    const notAllowedProps = this.context.options['not-allowed-props'];
    if (notAllowedProps) {
      for (let index = 0; index < notAllowedProps.length; index++) {
        const property = notAllowedProps[index];
        if (packagejson[property] !== undefined) {
          sandbox.report({
            message: `package.json includes the restricted property "${property}"`
          });
          return;
        }
      }
    }
  }

  getPackageJsonPath() {
    let packagejson = {};

    try {
      packagejson = require(path.join(this.context.filesystem.dirname, 'package.json'));
    } catch (error) {
      throw new Error(`Couldn't find a package.json`, error);
    }

    return packagejson;
  }
}

PackageJsonProperties.meta = {
  category: 'Built-in',
  description: 'Property restrictions over package.json',
  recommended: true,
  docsUrl: docs.getURL('package-json-properties')
};

module.exports = PackageJsonProperties;
