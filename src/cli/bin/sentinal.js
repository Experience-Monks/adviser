#!/usr/bin/env node

/**
 * @fileoverview CLI that is run via the sentinal command.
 *
 */

'use strict';

const errorHandler = require('../../core/errors/error-handler');
const cli = require('../cli');
const logger = require('../../utils/logger');

const isInitEnabled = process.argv.indexOf('--init') > -1;
const isDebugEnabled = process.argv.indexOf('--debug') > -1;

if (isDebugEnabled) {
  require('debug').enable('sentinal:*');
}

process.once('uncaughtException', errorHandler.onError);

if (isInitEnabled) {
  logger.info('TODO: Create init procedure');
} else {
  process.exitCode = cli.execute(process.argv);
}
