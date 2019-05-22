/**
 * @fileoverview Sentinal Rules.
 *
 */

'use strict';

const debug = require('debug')('sentinal:rules');

const SentinalRule = require('../plugins/rule');
const SeverityEnum = require('./severity');

const InvalidRuleError = require('../errors/exceptions/invalid-rule-error');

/**
 * CRUD for the rules
 *
 * @class Rules
 */
class Rules {
  constructor() {
    this._ruleScope = 'sentinal-plugin-';
    this._rules = {};
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
  add(ruleId, Rule, ruleSetting, pluginName) {
    if (!ruleId) return;

    if (!Rule || !(Rule.prototype instanceof SentinalRule)) {
      throw new InvalidRuleError(
        'Rule definition is invalid',
        ruleId,
        `The rule defined in the config file is invalid, check the plugin source code`
      );
    }

    const normalizedRuleId = this._normalizeRuleId(ruleId);
    const normalizedSettings = this._normalizeSettings(ruleSetting);
    this._rules[normalizedRuleId] = {
      settings: normalizedSettings,
      code: Rule,
      pluginName: pluginName,
      ruleId: ruleId
    };

    debug(`Rule ${normalizedRuleId} added`);
  }

  /**
   * Get rule based on id
   *
   * @param {String} ruleId
   * @returns
   * @memberof Rules
   */
  get(ruleId) {
    const normalizedRuleId = this._normalizeRuleId(ruleId);
    return this._rules[normalizedRuleId];
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
    this._rules = {};
  }

  /**
   * Add Rule Scope if doesn't exist from the rule Id
   *
   * @param {String} ruleId
   * @returns
   * @memberof Rules
   */
  _normalizeRuleId(ruleId) {
    if (ruleId.indexOf(this._ruleScope) < 0) {
      return `${this._ruleScope}${ruleId}`.toLowerCase();
    }

    return ruleId.toLowerCase();
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
