/**
 * @fileoverview Handler for Uncaught Exceptions.
 *
 */

'use strict';

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

const logger = require('../../utils/logger');

/**
 * Load a templated message or stream the error to the terminal
 *
 * @param {Error} NodeJS Error Object
 */
function errorHandler(exceptionError) {
  if (typeof exceptionError.messageTemplate === 'string' && exceptionError.messageTemplate.length > 0) {
    const template = lodash.template(
      fs.readFileSync(path.resolve(__dirname, `./messages/${exceptionError.messageTemplate}.txt`), 'utf-8')
    );
    const pkg = require('../../../package.json');

    logger.error('\nOops! Something went wrong! :(');
    logger.error(`\nSentinal: v${pkg.version}\n${template(exceptionError.data || {})}`);
  } else {
    logger.error(exceptionError.stack);
  }

  process.exitCode = 2;
}

module.exports = errorHandler;
