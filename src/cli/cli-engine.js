/**
 * @fileoverview Main CLI object
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const debug = require('debug')('sentinal:cli-engine');

const defaultOptions = require('./default-engine-options');
const Config = require('../config/config');

class CLIEngine {
  constructor(providedOptions) {
    debug('Running CLI Engine');
    this.options = Object.assign({}, defaultOptions, { cwd: process.cwd() }, providedOptions);

    this.config = new Config(this.options.cwd, this.options.configFile);
  }
}

module.exports = CLIEngine;
