/**
 * @fileoverview Parses the CLI parameters options
 *
 */

'use strict';

const debug = require('debug')('sentinal:cli');

const Config = require('../core/config/config');
const Engine = require('../core/engine');
const options = require('./options');
const logger = require('../utils/logger');
const globalContext = require('../core/global-context');

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
  execute(args) {
    let currentOptions;

    try {
      currentOptions = options.parse(args);
    } catch (error) {
      logger.error(error.message);
      logger.info(`\nRun 'sentinal -h' to discover the available parameters`);
      return 2;
    }

    if (currentOptions.version) {
      logger.info(`v${globalContext.getVersion()}`);
    } else if (currentOptions.help) {
      logger.info(options.generateHelp());
    } else {
      debug('Sentinal running the engine');

      const engineOptions = this._prepareEngineOptions(currentOptions);

      const config = new Config(engineOptions.cwd, engineOptions.configFile);

      const engine = new Engine(config, engineOptions);

      engine.run();

      if (currentOptions.quiet) {
        debug('Quiet mode enabled - filtering out warnings');
        // TODO: To be build
      }

      return 2;
    }

    return 0;
  }

  /**
   * Create the engine options object
   *
   * @param {Object} cliOptions
   */
  _prepareEngineOptions(cliOptions) {
    const engineOptions = {
      outputFormat: cliOptions.format,
      cwd: process.cwd()
    };

    cliOptions.config && (engineOptions['configFile'] = cliOptions.config);
    cliOptions.output && (engineOptions['outputDirectory'] = cliOptions.output);

    return engineOptions;
  }
}

module.exports = new CLI();
