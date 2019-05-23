/**
 * @fileoverview Handler for Uncaught Exceptions.
 *
 */

'use strict';

const templateLoader = require('../../core/errors/template-loader');
const logger = require('../../utils/logger');
const packageInfo = require('../../package-info');

/**
 * Decide whetever load an error template or just print to the output
 *
 * @class ErrorHandler
 */
class ErrorHandler {
  /**
   * Handles error exceptions output
   *
   * @param {Error} NodeJS Error Object
   */
  onError(exceptionError) {
    if (typeof exceptionError.messageTemplate === 'string' && exceptionError.messageTemplate.length > 0) {
      templateLoader.setTemplateId(exceptionError.messageTemplate);
      const packageVersion = packageInfo.getVersion();

      if (templateLoader.exist()) {
        const template = templateLoader.load();

        logger.error('\nOops! Something went wrong! :(');
        logger.error(`\nAdviser: v${packageVersion}\n${template(exceptionError.data || {})}`);
      } else {
        logger.error('\nOops! Something went wrong! :(');
        logger.error(`\nAdviser: v${packageVersion}\nThe error template doesn't exist`);
      }
    } else {
      logger.error(exceptionError.stack);
    }

    process.exitCode = 2;
  }
}

module.exports = new ErrorHandler();
