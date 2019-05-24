/**
 * @fileoverview Parses the CLI parameters options
 *
 */

'use strict';

const debug = require('debug')('adviser:cli');

const Config = require('../core/config/config');
const Engine = require('../core/engine');
const Formatter = require('../core/formatters/formatter');

const options = require('./options');
const logger = require('../utils/logger');
const packageInfo = require('../package-info');

/**
 * CLI Entry point and option parser class
 *
 * @class CLI
 */
class CLI {
  /**
   * Execute CLI logic based on parameters
   *
   * @param {Array} args Process.argv output
   */
  execute(args, callback) {
    let currentOptions;
    let errorCode = 0;

    try {
      debug('Parsing the CLI options');
      currentOptions = options.parse(args);
    } catch (error) {
      logger.error(error.message);
      logger.info(`\nRun 'adviser -h' to discover the available parameters`);

      debug('Error parsing the CLI options', error);

      errorCode = 2;
      callback(errorCode);
      return;
    }

    if (currentOptions.version) {
      debug('Retrieving package version');
      logger.info(`v${packageInfo.getVersion()}`);
    } else if (currentOptions.help) {
      debug('Retrieving CLI help');
      logger.info(options.generateHelp());
    } else {
      debug(`Parsing CLI arguments ${JSON.stringify(currentOptions)} for the engine`);
      const engineOptions = this._prepareEngineOptions(currentOptions);

      const config = new Config(engineOptions['configFile'] || engineOptions.cwd);
      const engine = new Engine(config, engineOptions);

      engine
        .run()
        .then(() => {
          const issues = engine.getIssues();

          if (issues.length > 0) {
            this.printResults(engineOptions.outputFormat, issues);
            errorCode = 2;
          }

          callback(errorCode);
        })
        .catch(error => {
          logger.error('Some rules has failed the run', error);
          callback(errorCode);
        });
    }
  }

  /**
   * Print results in the console
   *
   * @param {*} format
   * @param {*} issues
   * @memberof CLI
   */
  printResults(format, issues) {
    const formatter = new Formatter(format);

    const output = formatter.getOutput(issues);

    if (output) {
      logger.info(output);
    }
  }

  /**
   * Create the engine options object
   *
   * @param {Object} cliOptions
   */
  _prepareEngineOptions(cliOptions) {
    const engineOptions = {
      outputFormat: 'base',
      cwd: process.cwd()
    };

    cliOptions.config && (engineOptions['configFile'] = cliOptions.config);

    return engineOptions;
  }
}

module.exports = new CLI();
