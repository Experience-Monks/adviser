/**
 * @fileoverview CLI Options parser
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const debug = require('debug')('sentinal:cli');

const CLIEngine = require('./cli-engine');
const options = require('./options');
const translateEngineOptions = require('./engine-options');
const printResults = require('./print-results');
const logger = require('../utils/logger');

class CLI {
  execute(args, text) {
    if (Array.isArray(args)) {
      debug('CLI args: %o', args.slice(2));
    }

    let currentOptions;

    try {
      currentOptions = options.parse(args);
    } catch (error) {
      logger.error(error.message);
      return 2;
    }

    const files = currentOptions._;

    if (currentOptions.version) {
      logger.info(`v${require('../package.json').version}`);
    } else if (currentOptions.printConfig) {
      if (files.length) {
        logger.error('The --print-config option must be used with exactly one file name.');
        return 2;
      }

      const engine = new CLIEngine(translateEngineOptions(currentOptions));

      const fileConfig = engine.getConfigForFile(currentOptions.printConfig);

      logger.info(JSON.stringify(fileConfig, null, '  '));
      return 0;
    } else if (currentOptions.help || !files.length) {
      logger.info(options.generateHelp());
    } else {
      debug('Sentinal running on files');

      const engine = new CLIEngine(translateEngineOptions(currentOptions));
      const report = engine.executeOnFiles(files);

      if (currentOptions.quiet) {
        debug('Quiet mode enabled - filtering out warnings');
        report.results = CLIEngine.getErrorResults(report.results);
      }

      if (printResults(engine, report.results, currentOptions.format, currentOptions.outputFile)) {
        const tooManyWarnings = currentOptions.maxWarnings >= 0 && report.warningCount > currentOptions.maxWarnings;

        if (!report.errorCount && tooManyWarnings) {
          logger.error('Sentinal found too many warnings (maximum: %s).', currentOptions.maxWarnings);
        }

        return report.errorCount || tooManyWarnings ? 1 : 0;
      }
      return 2;
    }

    return 0;
  }
}

module.exports = new CLI();
