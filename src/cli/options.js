/**
 * @fileoverview Options configuration for the CLI (with optionator).
 *
 */

'use strict';

const optionator = require('optionator');
const chalk = require('chalk');

module.exports = optionator({
  prepend: `adviser ${chalk.red('[options]')}`,
  defaults: {
    concatRepeatedArrays: true,
    defaults: Object
  },
  options: [
    {
      heading: chalk.yellow('Basic configuration')
    },
    {
      option: 'config',
      alias: 'c',
      type: 'Path',
      description: chalk.cyan('Specify config file path')
    },
    {
      heading: chalk.yellow('Output')
    },
    {
      option: 'verbose',
      type: 'Boolean',
      description: chalk.cyan('More information on runtime')
    },
    {
      heading: chalk.yellow('Miscellaneous')
    },
    {
      option: 'init',
      type: 'Boolean',
      description: chalk.cyan('Run config initialization wizard')
    },
    {
      option: 'debug',
      type: 'Boolean',
      description: chalk.cyan('Output debugging information')
    },
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: chalk.cyan('Show help')
    },
    {
      option: 'version',
      alias: 'v',
      type: 'Boolean',
      description: chalk.cyan('Output the version number')
    }
  ]
});
