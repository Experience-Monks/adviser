'use strict';

const rules = require('../../src/core/config/rules');
const InvalidRuleError = require('../../src/core/errors/exceptions/invalid-rule-error');

const AdviserRule = require('../../src/core/external/rule');
class MockAdviserRule extends AdviserRule {}

describe('Rules', () => {
  beforeEach(() => {
    rules.reset();
  });

  test('Add empty rule', () => {
    expect(() => {
      rules.add('', '', MockAdviserRule, {});
    }).toThrow(InvalidRuleError);
  });

  test('Add and get rule', () => {
    const ruleName = 'warning-min-test';

    rules.add(ruleName, '', MockAdviserRule, {});
    expect(rules.get(ruleName)).toBeDefined();
  });

  test('Add rule with invalid definition', () => {
    const ruleName = 'warning-min-test';

    function add() {
      rules.add(ruleName, '', null, {});
    }

    expect(add).toThrow(InvalidRuleError);
    expect(add).toThrow('Rule definition is invalid');
  });

  test('Get many rules', () => {
    for (let index = 0; index < 5; index++) {
      rules.add(`warning-min-test-${index}`, 'plugin-name', MockAdviserRule, {});
    }

    expect(Object.keys(rules.getAll()).length).toBe(5);
  });

  test('Severity is normalized correctly', () => {
    expect(rules._normalizeSeverity(0)).toBe('off');
    expect(rules._normalizeSeverity('off')).toBe('off');
    expect(rules._normalizeSeverity(1)).toBe('warn');
    expect(rules._normalizeSeverity('warn')).toBe('warn');
    expect(rules._normalizeSeverity(2)).toBe('error');
    expect(rules._normalizeSeverity('error')).toBe('error');
  });

  test('Empty settings are only including severity', () => {
    const settingWarn = 'warn';
    const settingNumeric = 1;

    expect(rules._normalizeSettings(settingWarn)).toMatchObject({
      severity: 'warn'
    });

    expect(rules._normalizeSettings(settingNumeric)).toMatchObject({
      severity: 'warn'
    });
  });

  test('Settings with options are parsed correctly', () => {
    const settingWarn = ['warn', { 'test-a': 'test', 'test-b': 'test' }];

    expect(rules._normalizeSettings(settingWarn)).toMatchObject({
      severity: 'warn',
      options: { 'test-a': 'test', 'test-b': 'test' }
    });
  });
});
