/**
 * @fileoverview Options configuration for optionator.
 *
 * Inspired on ESLint's architecture
 */

'use strict';

const optionator = require('optionator');

module.exports = optionator({
  prepend: 'sentinal [options] file.js [file.js] [dir]',
  defaults: {
    concatRepeatedArrays: true,
    mergeRepeatedObjects: true
  },
  options: [
    {
      heading: 'Basic configuration'
    },
    {
      option: 'sentinalrc',
      type: 'Boolean',
      default: 'true',
      description: 'Disable use of configuration from .sentinalrc.*'
    },
    {
      option: 'config',
      alias: 'c',
      type: 'path::String',
      description: 'Use this configuration, overriding .sentinalrc.* config options if present'
    },
    {
      option: 'env',
      type: '[String]',
      description: 'Specify environments'
    },
    {
      option: 'ext',
      type: '[String]',
      default: '.js',
      description: 'Specify file extensions to review'
    },
    {
      option: 'global',
      type: '[String]',
      description: 'Define global variables'
    },
    {
      option: 'parser',
      type: 'String',
      description: 'Specify the parser to be used'
    },
    {
      option: 'parser-options',
      type: 'Object',
      description: 'Specify parser options'
    },
    {
      heading: 'Specifying rules and plugins'
    },
    {
      option: 'rulesdir',
      type: '[path::String]',
      description: 'Use additional rules from this directory'
    },
    {
      option: 'plugin',
      type: '[String]',
      description: 'Specify plugins'
    },
    {
      option: 'rule',
      type: 'Object',
      description: 'Specify rules'
    },
    {
      heading: 'Ignoring files'
    },
    {
      option: 'ignore-path',
      type: 'path::String',
      description: 'Specify path of ignore file'
    },
    {
      option: 'ignore',
      type: 'Boolean',
      default: 'true',
      description: 'Disable use of ignore files and patterns'
    },
    {
      option: 'ignore-pattern',
      type: '[String]',
      description: 'Pattern of files to ignore (in addition to those in .sentinalignore)',
      concatRepeatedArrays: [
        true,
        {
          oneValuePerFlag: true
        }
      ]
    },
    {
      heading: 'Handling warnings'
    },
    {
      option: 'quiet',
      type: 'Boolean',
      default: 'false',
      description: 'Report errors only'
    },
    {
      option: 'max-warnings',
      type: 'Int',
      default: '-1',
      description: 'Number of warnings to trigger nonzero exit code'
    },
    {
      heading: 'Output'
    },
    {
      option: 'output-file',
      alias: 'o',
      type: 'path::String',
      description: 'Specify file to write report to'
    },
    {
      option: 'format',
      alias: 'f',
      type: 'String',
      default: 'stylish',
      description: 'Use a specific output format'
    },
    {
      option: 'color',
      type: 'Boolean',
      alias: 'no-color',
      description: 'Force enabling/disabling of color'
    },
    {
      heading: 'Inline configuration comments'
    },
    {
      option: 'inline-config',
      type: 'Boolean',
      default: 'true',
      description: 'Prevent comments from changing config or rules'
    },
    {
      option: 'report-unused-disable-directives',
      type: 'Boolean',
      default: false,
      description: 'Adds reported errors for unused sentinal-disable directives'
    },
    {
      heading: 'Caching'
    },
    {
      option: 'cache',
      type: 'Boolean',
      default: 'false',
      description: 'Only check changed files'
    },
    {
      option: 'cache-file',
      type: 'path::String',
      default: '.sentinalcache',
      description: 'Path to the cache file. Deprecated: use --cache-location'
    },
    {
      option: 'cache-location',
      type: 'path::String',
      description: 'Path to the cache file or directory'
    },
    {
      heading: 'Miscellaneous'
    },
    {
      option: 'init',
      type: 'Boolean',
      default: 'false',
      description: 'Run config initialization wizard'
    },
    {
      option: 'debug',
      type: 'Boolean',
      default: false,
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
    },
    {
      option: 'print-config',
      type: 'path::String',
      description: 'Print the configuration for the given file'
    }
  ]
});
