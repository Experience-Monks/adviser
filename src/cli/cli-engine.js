/**
 * @fileoverview Main CLI object
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const debug = require('debug')('sentinal:cli-engine');
const logger = require('../utils/logger');

const defaultOptions = {};

class CLIEngine {
  constructor(providedOptions) {
    const options = Object.assign({}, defaultOptions, { cwd: process.cwd() }, providedOptions);
    logger(options);
    debug('Running CLI Engine');
  }
}

module.exports = CLIEngine;
