'use strict';

const fs = require('fs');
const { promisify } = require('util');

const Rule = require('../../plugins/rule');
const docs = require('../../../utils/docs');

const readDirAsync = promisify(fs.readdir);

class RootFiles extends Rule {
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

  async run(sandbox) {
    const requiredFiles = this.context.options['required'];
    const blacklistedFiles = this.context.options['blacklist'];

    const files = await this._readRootDirectory();

    if (requiredFiles) {
      for (let index = 0; index < requiredFiles.length; index++) {
        if (!files.includes(requiredFiles[index])) {
          sandbox.report({
            message: `Your directory root is missing the required file ${requiredFiles[index]}`
          });
          return;
        }
      }
    }

    if (blacklistedFiles) {
      for (let index = 0; index < blacklistedFiles.length; index++) {
        if (files.includes(blacklistedFiles[index])) {
          sandbox.report({
            message: `Your directory root is including the restricted file ${blacklistedFiles[index]}`
          });
          return;
        }
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
  docsUrl: docs.getURL('root-files')
};

module.exports = RootFiles;
