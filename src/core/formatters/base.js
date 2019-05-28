/**
 * @fileoverview Base Terminal formatter
 *
 */

'use strict';

const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const table = require('text-table');

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}

/**
 * Creates an object composed of keys generated from the `key` of each element
 * in the collection. The value is an array of elements that generated that `key`
 * @param {traversable} traversable An array like collection
 * @param {string} key A arraykey for the grouping
 * @returns {string} A composed object
 */
function groupBy(traversable, key) {
  let result = {};
  Array.from(traversable).forEach(val => {
    const elementKey = val[key];
    if (!Object.hasOwnProperty(elementKey)) {
      result[elementKey] = [];
    }
    result[elementKey].push(val);
  });
  return result;
}

/**
 * Creates a result output for the terminal
 * @param {Object} results
 * @returns {String} Summary output
 */
function base(results) {
  let output = `\n  ${chalk.blue('Output')} \n\n`;
  let errorCount = 0;
  let warningCount = 0;
  let summaryColor = 'yellow';

  if (results.length === 0) {
    return;
  }

  const resultsByPlugins = groupBy(results, 'pluginName');

  Object.keys(resultsByPlugins).forEach(pluginName => {
    output += `  ${chalk.underline(pluginName)}\n`;

    const tableData = resultsByPlugins[pluginName].map(result => {
      errorCount = result.severity === 'error' ? errorCount + 1 : errorCount;
      warningCount = result.severity === 'warn' ? warningCount + 1 : warningCount;

      let messageType;

      if (result.severity === 'error') {
        messageType = chalk.red('error');
        summaryColor = 'red';
      } else {
        messageType = chalk.yellow('warning');
      }

      return ['', messageType, result.params.message.replace(/([^ ])\.$/u, '$1'), chalk.dim(result.ruleName || '')];
    });

    output += `${table(tableData, {
      align: ['l'],
      stringLength(str) {
        return stripAnsi(str).length;
      }
    })
      .split('\n')
      .map(el => el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)))
      .join('\n')}\n\n`;
  });

  const total = errorCount + warningCount;

  if (total > 0) {
    output +=
      '  ' +
      chalk[summaryColor].bold(
        [
          '\u2716 ',
          total,
          pluralize(' problem', total),
          ' (',
          errorCount,
          pluralize(' error', errorCount),
          ', ',
          warningCount,
          pluralize(' warning', warningCount),
          ')\n'
        ].join('')
      );
  }

  return total > 0 ? output : '';
}

module.exports = base;
