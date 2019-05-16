/**
 * @fileoverview Handler for Uncaught Exceptions.
 *
 */

'use strict';

const logger = require('../../utils/logger');
const globalContext = require('../global-context');

/**
 * Decide whetever load an error template or just print to the output
 *
 * @class ErrorHandler
 */
class ErrorHandler {
  constructor(templateLoaderInstance) {
    this.templateLoader = templateLoaderInstance;
  }

  /**
   * Handles error exceptions output
   *
   * @param {Error} NodeJS Error Object
   */
  onError(exceptionError) {
    if (typeof exceptionError.messageTemplate === 'string' && exceptionError.messageTemplate.length > 0) {
      this.templateLoader.setTemplateId(exceptionError.messageTemplate);
      const packageVersion = globalContext.getVersion();

      if (this.templateLoader.exist()) {
        const template = this.templateLoader.load();

        logger.error('\nOops! Something went wrong! :(');
        logger.error(`\nSentinal: v${packageVersion}\n${template(exceptionError.data || {})}`);
      } else {
        logger.error('\nOops! Something went wrong! :(');
        logger.error(`\nSentinal: v${packageVersion}\nThe error template doesn't exist`);
      }
    } else {
      logger.error(exceptionError.stack);
    }

    process.exitCode = 2;
  }
}

module.exports = ErrorHandler;
