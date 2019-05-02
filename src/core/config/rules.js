'use strict';

function normalizeRule(rule, setting) {
  const parsedSettings = parseSettings(setting);
  return typeof rule === 'function'
    ? Object.assign({ create: rule, settings: parsedSettings }, rule)
    : Object.assign({ settings: parsedSettings }, rule);
}

function parseSettings(setting) {
  const parsedSetting = {};
  if (typeof setting === 'string') {
    parsedSetting['severity'] = setting;
  }

  if (Array.isArray(setting)) {
    parsedSetting['severity'] = setting[0];

    if (setting.length >= 2) {
      parsedSetting['options'] = setting[1];
    }
  }

  return parsedSetting;
}

function normalizeRuleName(ruleId) {
  if (ruleId.indexOf('sentinal-plugin') < 0) {
    return `sentinal-plugin-${ruleId}`;
  }

  return ruleId;
}

class Rules {
  constructor() {
    this._rules = Object.create(null);
  }

  define(ruleId, ruleModule, ruleSetting) {
    this._rules[ruleId] = normalizeRule(ruleModule, ruleSetting);
  }

  get(ruleId) {
    const normalizedRuleId = normalizeRuleName(ruleId);
    return this._rules[normalizedRuleId];
  }

  getAllLoadedRules() {
    const allRules = new Map();

    Object.keys(this._rules).forEach(name => {
      const rule = this.get(name);

      allRules.set(name, rule);
    });
    return allRules;
  }
}

module.exports = Rules;
