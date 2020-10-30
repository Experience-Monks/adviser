#!/usr/bin/env node

/**
 * @fileoverview CLI that is run via the adviser command.
 *
 */

'use strict';

const errorHandler = require('../../core/errors/error-handler');
const cli = require('../cli');
const init = require('../init');

const isInitEnabled = process.argv.indexOf('--init') > -1;
const isDebugEnabled = process.argv.indexOf('--debug') > -1 || process.argv.indexOf('-d') > -1;

if (isDebugEnabled) {
  require('debug').enable('adviser:*');
}

process.once('uncaughtException', errorHandler.onError);

if (isInitEnabled) {
  init.createTemplate();
} else {
  cli.execute(process.argv, exitCode => {
    process.exitCode = exitCode;
  });
}
