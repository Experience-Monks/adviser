/**
 * @fileoverview Base Terminal formatter
 *
 */

'use strict';

const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const table = require('text-table');
const hyperlinker = require('hyperlinker');
const pluralize = require('pluralize');

const groupBy = require('../../utils/groupBy');

/**
 * Creates a result output for the terminal
 * @param {Object} results
 * @param {Array} rules
 * @returns {String} Summary output
 */
function base(results, rules) {
  let output = `\n  ${chalk.blue('Output')} \n\n`;
  let summaryColor = 'yellow';

  if (results.items.length === 0) {
    return;
  }

  const resultsByPlugins = groupBy(results.items, 'pluginName');

  Object.keys(resultsByPlugins).forEach(pluginName => {
    output += `  Plugin: ${chalk.underline(pluginName)}\n`;
    const tableData = [];

    resultsByPlugins[pluginName].forEach(result => {
      const rule = rules.find(rule => rule.id === result.ruleName && rule.pluginName === pluginName);

      let messageType;

      if (rule.severity === 'error') {
        messageType = chalk.red('error');
        summaryColor = 'red';
      } else {
        messageType = chalk.yellow('warning');
      }

      tableData.push([
        '',
        messageType,
        result.params.message.replace(/([^ ])\.$/u, '$1'),
        hyperlinker(chalk.dim(result.ruleName || ''), rule.core.meta.docsUrl),
        `${chalk.white.bgRed(rule.executionDuration + 'ms')}`
      ]);
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

  const total = results.total.errors + results.total.warnings;

  if (total > 0) {
    output +=
      '  ' +
      chalk[summaryColor].bold(
        [
          '\u2716 ',
          total,
          pluralize(' problem', total),
          ' (',
          results.total.errors,
          pluralize(' error', results.total.errors),
          ', ',
          results.total.warnings,
          pluralize(' warning', results.total.warnings),
          ')\n'
        ].join('')
      );
  }

  return total > 0 ? output : '';
}

module.exports = base;
