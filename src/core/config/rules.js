/**
 * @fileoverview Adviser Rules.
 *
 */

'use strict';

const debug = require('debug')('adviser:rules');

const Rule = require('../rule/rule');
const SeverityEnum = require('./severity-enum');
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
  add(ruleId, ruleFullName, pluginName, RuleCore, ruleSetting) {
    if (!ruleId || !RuleCore) {
      debug(`The rule with id ${ruleId} and core ${RuleCore} couldn't be added`);
      throw new InvalidRuleError(
        'Rule definition is invalid',
        ruleId,
        `The rule defined in the config file is invalid, check the plugin source code`
      );
    }

    const normalizedSettings = this._normalizeSettings(ruleSetting);

    const rule = new Rule(
      ruleId,
      ruleFullName,
      pluginName,
      RuleCore,
      normalizedSettings.severity,
      normalizedSettings.options
    );

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
    return this._rules.find(rule => rule.id === ruleId);
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
   * Get rules filtered by tags
   *
   * @param {Array} [requestedTags=[]]
   * @param {Object} [settingsTags={}]
   * @returns {Array} rules
   * @memberof Rules
   */
  getByTag(requestedTags = [], settingsTags = {}) {
    const filteredRulesBySettings = this._getRulesFilteredBySettingTags(requestedTags, settingsTags);
    const filteredRulesByMetaTags = this._getRulesFilteredByMetaTags(requestedTags, settingsTags);

    const filteredRules = {};
    filteredRulesBySettings.forEach(rule => {
      filteredRules[rule.id] = rule;
    });
    filteredRulesByMetaTags.forEach(rule => {
      if (!filteredRules[rule.id]) {
        filteredRules[rule.id] = rule;
      }
    });

    return Object.values(filteredRules);
  }

  /**
   * Get rules filtered by tags based on the tags defined in the rule's metadata
   *
   * @param {Array} tags
   * @param {Object} settingsTags
   * @returns {Array} rules
   * @memberof Rules
   */
  _getRulesFilteredByMetaTags(tags, settingsTags = {}) {
    const settingsTagsList = Object.keys(settingsTags);
    return this._rules.filter(rule => {
      if (rule.core.meta.tags) {
        // Exclude tags that are defined in settingsTags
        const excludedTags = rule.core.meta.tags.filter(tag => !settingsTagsList.includes(tag));
        const filteredTags = excludedTags.filter(tag => tags.includes(tag));
        if (filteredTags.length > 0) return true;
      }

      return false;
    });
  }

  /**
   * Get rules filtered by tags defined in the settings property of the configuration file
   *
   * @param {Array} tags
   * @param {Object} settingsTags
   * @returns {Array} rules
   * @memberof Rules
   */
  _getRulesFilteredBySettingTags(tags, settingsTags) {
    let ruleNames = [];

    tags.forEach(tag => {
      if (settingsTags[tag]) {
        ruleNames = ruleNames.concat(settingsTags[tag]);
      }
    });

    return this._rules.filter(rule => ruleNames.includes(rule.fullRuleName));
  }

  /**
   * Destroy all the loaded rules
   *
   * @memberof Rules
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
