#!/usr/bin/env node

/**
 * @fileoverview CLI that is run via the sentinal command.
 *
 */

'use strict';

const uncaughtExceptionHandler = require('./uncaughtExceptionHandler');
const cli = require('../cli/cli');
const logger = require('../utils/logger');

const isInitEnabled = process.argv.indexOf('--init') > -1;
const isDebugEnabled = process.argv.indexOf('--debug') > -1;

if (isDebugEnabled) {
  require('debug').enable('sentinal:*');
}

process.once('uncaughtException', uncaughtExceptionHandler);

if (isInitEnabled) {
  logger.info('TODO: [In Progress] Create init procedure');
} else {
  process.exitCode = cli.execute(process.argv);
}
