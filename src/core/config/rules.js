'use strict';

const debug = require('debug')('sentinal:rules');
const is = require('@sindresorhus/is');

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
   * @memberof Rules
   * @returns {Void}
   */
  add(ruleId, rule, ruleSetting) {
    if (!ruleId) return;

    if (!rule || !rule.create || !is.function(rule.create)) {
      throw new InvalidRuleError(
        'Rule definition is invalid',
        ruleId,
        `The rule defined in the config file is invalid, check the plugin source code`
      );
    }

    const normalizedRuleId = this._normalizeRuleId(ruleId);
    const normalizedSettings = this._normalizeSettings(ruleSetting);
    this._rules[normalizedRuleId] = Object.assign({ settings: normalizedSettings }, rule);

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
    const allRules = new Map();

    Object.keys(this._rules).forEach(name => {
      const rule = this.get(name);

      allRules.set(name, rule);
    });
    return allRules;
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
    const parsedSetting = {};
    if (typeof setting === 'string' || Number.isInteger(setting)) {
      parsedSetting['severity'] = this._normalizeSeverity(setting);
    }

    if (Array.isArray(setting)) {
      parsedSetting['severity'] = this._normalizeSeverity(setting[0]);

      if (setting.length >= 2) {
        parsedSetting['options'] = setting[1];
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
