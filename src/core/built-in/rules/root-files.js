'use strict';

const fs = require('fs');
const { promisify } = require('util');
const pluralize = require('pluralize');

const Rule = require('../../external/rule');
const docs = require('../../../utils/docs');

const readDirAsync = promisify(fs.readdir);

class RootFiles extends Rule {
  constructor(context) {
    super(context);

    if (!this.context.options['required'] && !this.context.options['blocklist']) {
      throw new Error(`The rule must have at least one option, "required" or "blocklist"`);
    }

    if (this.context.options['required'] && !Array.isArray(this.context.options['required'])) {
      throw new Error(`Wrong "required" argument, an array is expected`);
    }

    if (this.context.options['blocklist'] && !Array.isArray(this.context.options['blocklist'])) {
      throw new Error(`Wrong "blocklist" argument, an array is expected`);
    }
  }

  async run(sandbox) {
    const files = await this._readRootDirectory();

    const requiredFiles = this.context.options['required'];
    if (requiredFiles) {
      const missingFiles = requiredFiles.filter(requiredFile => !files.includes(requiredFile));

      if (missingFiles.length > 0) {
        sandbox.report({
          message: `Your directory root is missing the required ${pluralize(
            'file',
            missingFiles.length
          )}: ${missingFiles.join(', ')}`
        });
      }
    }

    const blocklistedFiles = this.context.options['blocklist'];
    if (blocklistedFiles) {
      const notAllowedFiles = blocklistedFiles.filter(blocklistedFile => files.includes(blocklistedFile));

      if (notAllowedFiles.length > 0) {
        sandbox.report({
          message: `Your directory root is including the restricted ${pluralize(
            'file',
            notAllowedFiles.length
          )}: ${notAllowedFiles.join(', ')}`
        });
      }
    }
  }

  async _readRootDirectory() {
    try {
      return await readDirAsync(this.context.filesystem.dirname);
    } catch (error) {
      throw new Error(error);
    }
  }
}

RootFiles.meta = {
  category: 'Built-in',
  description: 'File restrictions on the directory root',
  recommended: true,
  docsUrl: docs.getURL('root-files'),
  tags: ['quick', 'fs']
};

module.exports = RootFiles;
