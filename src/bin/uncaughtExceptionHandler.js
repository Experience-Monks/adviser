/**
 * @fileoverview Handler for Uncaught Exceptions.
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

function uncaughtExceptionHandler(exceptionError) {
  if (typeof exceptionError.messageTemplate === 'string' && exceptionError.messageTemplate.length > 0) {
    const template = lodash.template(
      fs.readFileSync(path.resolve(__dirname, `../messages/${exceptionError.messageTemplate}.txt`), 'utf-8')
    );
    const pkg = require('../package.json');

    console.error('\nOops! Something went wrong! :(');
    console.error(`\nSentinal: ${pkg.version}.\n${template(exceptionError.messageData || {})}`);
  } else {
    console.error(exceptionError.stack);
  }

  process.exitCode = 2;
}

module.exports = uncaughtExceptionHandler;
