/**
 * @fileoverview Options configuration for optionator.
 *
 */

'use strict';

const optionator = require('optionator');

module.exports = optionator({
  prepend: 'sentinal [options] file.js [file.js] [dir]',
  defaults: {
    concatRepeatedArrays: true,
    defaults: Object
  },
  options: [
    {
      heading: 'Basic configuration'
    },
    {
      option: 'config',
      alias: 'c',
      type: 'path::String',
      description: 'Use this configuration, overriding .sentinalrc.* config options if present'
    },
    {
      heading: 'Handling warnings'
    },
    {
      option: 'quiet',
      type: 'Boolean',
      description: 'Report errors only'
    },
    {
      heading: 'Output'
    },
    {
      option: 'output',
      alias: 'o',
      type: 'String',
      description: 'Specify file to write report to'
    },
    {
      option: 'format',
      alias: 'f',
      type: 'String',
      default: 'base',
      description: 'Use a specific output format'
    },
    {
      heading: 'Miscellaneous'
    },
    {
      option: 'init',
      type: 'Boolean',
      description: 'Run config initialization wizard'
    },
    {
      option: 'debug',
      type: 'Boolean',
      description: 'Output debugging information'
    },
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Show help'
    },
    {
      option: 'version',
      alias: 'v',
      type: 'Boolean',
      description: 'Output the version number'
    }
  ]
});
