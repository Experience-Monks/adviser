/**
 * @fileoverview Main CLI object
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const debug = require('debug')('sentinal:cli-engine');

const logger = require('../utils/logger');

const defaultOptions = require('./default-engine-options');
const Config = require('../config/config');

class CLIEngine {
  constructor(providedOptions) {
    debug('Running CLI Engine');
    this.options = Object.assign({}, defaultOptions, { cwd: process.cwd() }, providedOptions);

    this.config = new Config(this.options.cwd, this.options.configFile);

    this._rawIssues = [];
  }

  run() {
    // TODO: Make it running in parallel
    this.config.rules.getAllLoadedRules().forEach(rule => {
      const ruleContext = {
        options: rule.settings,
        dirname: this.options.cwd,
        report: params => {
          const context = {
            pluginName: 'audit-npm',
            severity: this.normalizeSeverity(rule.settings.severity),
            ruleName: 'min-vulnerabilities-allowed',
            params
          };
          this.processRuleOutput(context);
        }
      };
      rule.create(ruleContext);
    });

    this.printResults();
  }

  processRuleOutput(context) {
    this._rawIssues.push(context);
  }

  getFormatter(format) {
    const formatName = 'stylish';
    const formatterPath = `../formatters/${formatName}`;

    try {
      return require(formatterPath);
    } catch (ex) {
      throw new Error(`There was a problem loading formatter: ${formatterPath}\nError: ${ex.message}`);
    }
  }

  printResults() {
    const formatter = this.getFormatter();

    const output = formatter(this._rawIssues);

    if (output) {
      logger.info(output);
    }
  }

  normalizeSeverity(severity) {
    if ((severity === 'error') | 2) {
      return 'error';
    }

    if ((severity === 'warn') | 1) {
      return 'warn';
    }

    return 'off';
  }
}

module.exports = CLIEngine;
