/**
 * @fileoverview Translate options from CLI to Engine.
 *
 * Inspired on ESLint's architecture
 */

'use strict';

function translateOptionsForEngine(cliOptions) {
  return {
    envs: cliOptions.env,
    extensions: cliOptions.ext,
    rules: cliOptions.rule,
    plugins: cliOptions.plugin,
    globals: cliOptions.global,
    ignore: cliOptions.ignore,
    ignorePath: cliOptions.ignorePath,
    ignorePattern: cliOptions.ignorePattern,
    configFile: cliOptions.config,
    rulePaths: cliOptions.rulesdir,
    useSentinalrc: cliOptions.sentinalrc,
    parser: cliOptions.parser,
    parserOptions: cliOptions.parserOptions,
    cache: cliOptions.cache,
    cacheFile: cliOptions.cacheFile,
    cacheLocation: cliOptions.cacheLocation,
    allowInlineConfig: cliOptions.inlineConfig,
    reportUnusedDisableDirectives: cliOptions.reportUnusedDisableDirectives
  };
}

module.exports = translateOptionsForEngine;
