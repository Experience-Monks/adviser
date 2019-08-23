'use strict';

const path = require('path');

const Rule = require('../../plugins/rule');
const docs = require('../../../utils/docs');

class PackageJsonProperties extends Rule {
  constructor(context) {
    super(context);

    if (!this.context.options['required'] && !this.context.options['blacklist']) {
      throw new Error(`The rule must have at least one option, "required" or "blacklist"`);
    }

    if (this.context.options['required'] && !Array.isArray(this.context.options['required'])) {
      throw new Error(`Wrong "required" argument, an array is expected`);
    }

    if (this.context.options['blacklist'] && !Array.isArray(this.context.options['blacklist'])) {
      throw new Error(`Wrong "blacklist" argument, an array is expected`);
    }
  }

  run(sandbox) {
    const packagejson = this._getPackageJsonPath();

    const requiredProps = this.context.options['required'];
    if (requiredProps) {
      for (let index = 0; index < requiredProps.length; index++) {
        const property = requiredProps[index];
        if (!packagejson.hasOwnProperty(property)) {
          sandbox.report({
            message: `package.json is missing the required property "${property}"`
          });
          return;
        }
      }
    }

    const blacklistedProps = this.context.options['blacklist'];
    if (blacklistedProps) {
      for (let index = 0; index < blacklistedProps.length; index++) {
        const property = blacklistedProps[index];
        if (packagejson.hasOwnProperty(property)) {
          sandbox.report({
            message: `package.json includes the restricted property "${property}"`
          });
          return;
        }
      }
    }
  }

  _getPackageJsonPath() {
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
