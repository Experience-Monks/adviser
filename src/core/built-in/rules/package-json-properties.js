'use strict';

const path = require('path');

const pluralize = require('pluralize');

const Rule = require('../../external/rule');
const docs = require('../../../utils/docs');

class PackageJsonProperties extends Rule {
  constructor(context) {
    super(context);

    if (!this.context.options.required && !this.context.options.blacklist) {
      throw new Error(`The rule must have at least one option, "required" or "blacklist"`);
    }

    if (this.context.options.required && !Array.isArray(this.context.options.required)) {
      throw new Error(`Wrong "required" argument, an array is expected`);
    }

    if (this.context.options.blacklist && !Array.isArray(this.context.options.blacklist)) {
      throw new Error(`Wrong "blacklist" argument, an array is expected`);
    }
  }

  run(sandbox) {
    const packagejson = this._getPackageJsonPath();

    const requiredProps = this.context.options.required;
    if (requiredProps) {
      const missingProps = requiredProps.filter(
        (requiredProp) => !Object.prototype.hasOwnProperty.call(packagejson, requiredProp)
      );

      if (missingProps.length > 0) {
        sandbox.report({
          message: `The package.json is missing the required ${pluralize(
            'property',
            missingProps.length
          )}: ${missingProps.join(', ')}`,
        });
      }
    }

    const blacklistedProps = this.context.options.blacklist;
    if (blacklistedProps) {
      const notAllowedProps = blacklistedProps.filter((blacklistedProp) =>
        Object.prototype.hasOwnProperty.call(packagejson, blacklistedProp)
      );

      if (notAllowedProps.length > 0) {
        sandbox.report({
          message: `The package.json includes the restricted ${pluralize(
            'property',
            notAllowedProps.length
          )}: ${notAllowedProps.join(', ')}`,
        });
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
  docsUrl: docs.getURL('package-json-properties'),
  tags: ['quick', 'packagejson'],
};

module.exports = PackageJsonProperties;
