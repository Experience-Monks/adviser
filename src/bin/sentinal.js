#!/usr/bin/env node

/**
 * @fileoverview CLI that is run via the sentinal command.
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const uncaughtExceptionHandler = require('./uncaughtExceptionHandler');
const cli = require('../cli');

// TODO: Use here yargs-parser or an alternative
const init = process.argv.indexOf('--init') > -1;

process.once('uncaughtException', uncaughtExceptionHandler);

if (init) {
  // TODO: Create init procedure
} else {
  process.exitCode = cli.execute(process.argv);
}
