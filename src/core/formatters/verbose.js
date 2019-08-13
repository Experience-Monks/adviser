/**
 * @fileoverview Base Terminal formatter
 *
 */

'use strict';

const chalk = require('chalk');

/**
 * Creates a result output for the terminal
 * @param {Object} results
 * @returns {String} Summary output
 */
function verbose(results) {
  let output = `\n  ${chalk.blue('More information from plugin rules')} \n\n`;

  const verboseResults = results.items.filter(result => result.params.verbose !== undefined);

  if (verboseResults.length === 0) {
    return;
  }

  verboseResults.forEach(result => {
    const title = `${result.pluginName}/${result.ruleName}`;

    output += `  ${chalk.underline(title)}\n`;
    output += `  ${result.params.verbose}\n\n`;
  });

  return output;
}

module.exports = verbose;
