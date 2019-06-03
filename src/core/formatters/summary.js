/**
 * @fileoverview Base Terminal formatter
 *
 */

'use strict';

const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const table = require('text-table');

const RuleStatusEnum = require('../rule/lifecycle/rule-status-enum');

/**
 * Creates a result output for the terminal with skipped rules
 * @param {Object} results
 * @param {Array} rules
 * @returns {String} Summary output
 */
function skippedRulesOutput(results, rules) {
  let output = `\n  ${chalk.blue('Adviser Summary')} \n\n`;

  const rulesMap = rules.map(rule => {
    return ['', rule.pluginName, rule.id, getRuleStatusColor(rule.lifeCycleStatus)];
  });

  rulesMap.unshift(['', chalk.underline('Plugin'), chalk.underline('Rule'), chalk.underline('Status')]);

  output += `${table(rulesMap, {
    align: ['l'],
    stringLength(str) {
      return stripAnsi(str).length;
    }
  })}\n\n`;

  return output;
}

function getRuleStatusColor(ruleStatus) {
  switch (ruleStatus) {
    case RuleStatusEnum.Failed:
      return chalk.red(RuleStatusEnum.Failed).toLowerCase();
    case RuleStatusEnum.Skipped:
      return chalk.gray(RuleStatusEnum.Skipped).toLowerCase();
    case RuleStatusEnum.Completed:
      return chalk.green(RuleStatusEnum.Completed).toLowerCase();
    default:
      return ruleStatus.toLowerCase();
  }
}

module.exports = skippedRulesOutput;
