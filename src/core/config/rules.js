/**
 * @fileoverview Sentinal Rules.
 *
 */

'use strict';

const debug = require('debug')('sentinal:rules');

const PluginRule = require('../plugins/rule');
const Rule = require('../rule/rule');
const SeverityEnum = require('./severity');

const InvalidRuleError = require('../errors/exceptions/invalid-rule-error');

/**
 * CRUD for the rules
 *
 * @class Rules
 */
class Rules {
  constructor() {
    this._rules = [];
  }

  /**
   * Parses the raw rule and add it to the instance
   *
   * @param {String} ruleId
   * @param {Object} rule
   * @param {String | Object} ruleSetting
   * @param {String} pluginName
   * @memberof Rules
   * @returns {Void}
   */
  add(ruleId, pluginName, RuleCore, ruleSetting) {
    if (!ruleId) return;

    if (!RuleCore || !(RuleCore.prototype instanceof PluginRule)) {
      throw new InvalidRuleError(
        'Rule definition is invalid',
        ruleId,
        `The rule defined in the config file is invalid, check the plugin source code`
      );
    }

    const normalizedSettings = this._normalizeSettings(ruleSetting);

    const rule = new Rule(ruleId, pluginName, RuleCore, normalizedSettings.severity, normalizedSettings.options);

    this._rules.push(rule);

    debug(`Rule ${ruleId} added`);
  }

  /**
   * Get rule based on id
   *
   * @param {String} ruleId
   * @returns
   * @memberof Rules
   */
  get(ruleId) {
    const rules = this._rules.find(rule => rule.id === ruleId);

    if (rules) {
      return rules[0];
    }

    return false;
  }

  /**
   * Get all the rules
   *
   * @returns {Object} rules
   * @memberof Rules
   */
  getAll() {
    return this._rules;
  }

  /**
   * Destroy all the loaded rules
   *
   * @memberof Plugins
   */
  reset() {
    this._rules = [];
  }

  /**
   * Transform the raw rule settings into a well defined object
   *
   * @param {Object | String} setting
   * @returns {Object}
   * @memberof Rules
   */
  _normalizeSettings(setting) {
    const parsedSetting = { severity: SeverityEnum.Off, options: {} };
    if (typeof setting === 'string' || Number.isInteger(setting)) {
      parsedSetting.severity = this._normalizeSeverity(setting);
    }

    if (Array.isArray(setting)) {
      parsedSetting.severity = this._normalizeSeverity(setting[0]);

      if (setting.length >= 2) {
        parsedSetting.options = setting[1];
      }
    }

    return parsedSetting;
  }

  /**
   * Return always the severity as a string
   *
   * @param {Number | String} severity
   * @returns
   * @memberof Rules
   */
  _normalizeSeverity(severity) {
    if (severity === 2 || severity === SeverityEnum.Error) {
      return SeverityEnum.Error;
    } else if (severity === 1 || severity === SeverityEnum.Warning) {
      return SeverityEnum.Warning;
    }

    return SeverityEnum.Off;
  }
}

module.exports = new Rules();
