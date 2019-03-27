/**
 * @fileoverview CLI Options parser
 *
 * Parses the parameters options
 */

'use strict';

const debug = require('debug')('sentinal:cli');

const CLIEngine = require('./cli-engine');
const options = require('./options');
const logger = require('../utils/logger');

class CLI {
  execute(args, text) {
    let currentOptions;

    try {
      currentOptions = options.parse(args);
    } catch (error) {
      logger.error(error.message);
      logger.info(`\nRun 'sentinal -h' to discover the available parameters`);
      return 2;
    }

    if (currentOptions.version) {
      logger.info(`v${require('../../package.json').version}`);
    } else if (currentOptions.help) {
      logger.info(options.generateHelp());
    } else {
      debug('Sentinal running on files');

      const engineOptions = this.prepareEngineOptions(currentOptions);
      const engine = new CLIEngine(engineOptions);

      logger.info(engine);

      if (currentOptions.quiet) {
        debug('Quiet mode enabled - filtering out warnings');
      }

      return 2;
    }

    return 0;
  }

  prepareEngineOptions(cliOptions) {
    const engineOptions = {
      outputFormat: cliOptions.format
    };

    cliOptions.config && (engineOptions['configFile'] = cliOptions.config);
    cliOptions.output && (engineOptions['outputDirectory'] = cliOptions.output);

    return engineOptions;
  }
}

module.exports = new CLI();
