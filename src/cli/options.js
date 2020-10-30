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
      alias: 'v',
      type: 'Boolean',
      description: chalk.cyan('More information on runtime')
    },
    {
      heading: chalk.yellow('Warnings')
    },
    {
      option: 'quiet',
      type: 'Boolean',
      alias: 'q',
      description: chalk.cyan('Report errors only - default: false')
    },
    {
      heading: chalk.yellow('Funcionality')
    },
    {
      option: 'tags',
      alias: 't',
      type: '[String]',
      description: chalk.cyan('Specify list of tags; e.g fast,perf,pkg')
    },
    {
      heading: chalk.yellow('Miscellaneous')
    },
    {
      option: 'init',
      alias: 'i',
      type: 'Boolean',
      description: chalk.cyan('Run config initialization wizard')
    },
    {
      option: 'debug',
      alias: 'd',
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
      type: 'Boolean',
      alias: 'r',
      description: chalk.cyan('Output the version number')
    }
  ]
});
