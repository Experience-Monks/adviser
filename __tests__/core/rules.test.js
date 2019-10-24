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

describe('Rules by Tags', () => {
  beforeEach(() => {
    rules.reset();
  });

  test('Filter rules by Metatags', () => {
    const rawRules = [
      {
        name: 'warning-min-test-1',
        core: {
          meta: {
            tags: ['fast', 'perf']
          }
        }
      },
      {
        name: 'warning-min-test-2',
        core: {
          meta: {
            tags: ['slow', 'perf']
          }
        }
      },
      {
        name: 'warning-min-test-3',
        core: {
          meta: {
            tags: ['testing', 'noperf', 'slow']
          }
        }
      }
    ];

    rawRules.forEach(rule => {
      rules.add(rule.name, '', rule.core, {});
    });

    expect(rules._getRulesFilteredByMetaTags(['fast']).length).toBe(1);
    expect(rules._getRulesFilteredByMetaTags(['noperf']).length).toBe(1);
    expect(rules._getRulesFilteredByMetaTags(['slow']).length).toBe(2);
    expect(rules._getRulesFilteredByMetaTags(['perf']).length).toBe(2);
    expect(rules._getRulesFilteredByMetaTags(['fast', 'perf']).length).toBe(2);
    expect(rules._getRulesFilteredByMetaTags(['fast', 'perf', 'none']).length).toBe(2);
    expect(rules._getRulesFilteredByMetaTags(['slow', 'perf', 'none', 'null', 'true', 'false']).length).toBe(3);
    expect(rules._getRulesFilteredByMetaTags(['none', 'null', 'true', 'false']).length).toBe(0);
    expect(rules._getRulesFilteredByMetaTags([]).length).toBe(0);
  });

  test('Filter rules by Settings tags', () => {
    const rawRules = [
      {
        name: 'warning-min-test-1',
        core: {}
      },
      {
        name: 'warning-min-test-2',
        core: {}
      },
      {
        name: 'warning-min-test-3',
        core: {}
      }
    ];

    rawRules.forEach(rule => {
      rules.add(rule.name, '', rule.core, {});
    });

    expect(rules._getRulesFilteredBySettingTags(['fast'], { fast: ['warning-min-test-3'] }).length).toBe(1);
    expect(rules._getRulesFilteredBySettingTags(['perf'], { fast: ['warning-min-test-3'] }).length).toBe(0);
    expect(
      rules._getRulesFilteredBySettingTags(['quick'], {
        quick: ['warning-min-test-3', 'warning-min-test-2', 'warning-min-test-1']
      }).length
    ).toBe(3);
    expect(
      rules._getRulesFilteredBySettingTags(['test', 'another', 'quick'], {
        quick: ['warning-min-test-3', 'warning-min-test-2', 'warning-min-test-1']
      }).length
    ).toBe(3);
    expect(
      rules._getRulesFilteredBySettingTags(['test', 'another', 'quick'], {
        quick: ['warning-min-test-3', 'warning-min-test-2', 'warning-min-test-1'],
        another: ['warning-min-test-3', 'warning-min-test-1'],
        diff: ['warning-min-test-3', 'warning-min-test-2', 'warning-min-test-1']
      }).length
    ).toBe(3);
    expect(
      rules._getRulesFilteredBySettingTags(['diff', 'another', 'quick'], {
        quick: ['warning-min-test-3'],
        another: ['warning-min-test-3', 'warning-min-test-1'],
        diff: ['warning-min-test-2', 'warning-min-test-1']
      }).length
    ).toBe(3);
    expect(
      rules._getRulesFilteredBySettingTags(['diff', 'another', 'quick'], {
        diff: ['warning-min-test-y', 'warning-min-test-x']
      }).length
    ).toBe(0);
    expect(
      rules._getRulesFilteredBySettingTags(['diff', 'another', 'quick'], {
        diff: []
      }).length
    ).toBe(0);
    expect(rules._getRulesFilteredBySettingTags(['diff', 'another', 'quick'], {}).length).toBe(0);
  });

  test('Get by Tags', () => {
    const rawRules = [
      {
        name: 'warning-min-test-1',
        core: {
          meta: {
            tags: ['fast', 'perf']
          }
        }
      },
      {
        name: 'warning-min-test-2',
        core: {
          meta: {
            tags: ['slow', 'perf', 'another']
          }
        }
      },
      {
        name: 'warning-min-test-3',
        core: {
          meta: {
            tags: ['testing', 'noperf', 'slow']
          }
        }
      }
    ];

    rawRules.forEach(rule => {
      rules.add(rule.name, '', rule.core, {});
    });

    expect(rules.getByTag(['diff', 'another', 'slow'], {}).length).toBe(2);
    expect(
      rules.getByTag(['diff', 'another', 'slow'], { slow: ['warning-min-test-y', 'warning-min-test-x'] }).length
    ).toBe(1);
    expect(
      rules.getByTag(['diff', 'another', 'slow'], { slow: ['warning-min-test-y', 'warning-min-test-3'] }).length
    ).toBe(2);
    expect(
      rules.getByTag(['diff', 'another', 'slow'], { slow: ['warning-min-test-y', 'warning-min-test-1'] }).length
    ).toBe(2);
    expect(
      rules.getByTag(['testing', 'another', 'null'], {
        slow: ['warning-min-test-1', 'warning-min-test-3'],
        null: ['warning-min-test-2'],
        testing: ['warning-min-test-2']
      }).length
    ).toBe(1);
    expect(
      rules.getByTag(['testing'], {
        testing: ['warning-min-test-x']
      }).length
    ).toBe(0);
    expect(
      rules.getByTag(['testing'], {
        testing: ['warning-min-test-2']
      }).length
    ).toBe(1);
  });

  test('Override meta tags with settings', () => {
    const rawRules = [
      {
        name: 'warning-min-test-1',
        core: {
          meta: {
            tags: ['fast', 'perf']
          }
        }
      },
      {
        name: 'warning-min-test-2',
        core: {
          meta: {
            tags: ['slow', 'perf', 'another']
          }
        }
      }
    ];

    rawRules.forEach(rule => {
      rules.add(rule.name, '', rule.core, {});
    });

    expect(rules.getByTag(['fast'], { fast: ['warning-min-test-2'] }).length).toBe(1);
    expect(rules.getByTag(['slow'], { fast: ['warning-min-test-2'] }).length).toBe(1);
    expect(rules.getByTag(['nonexist'], { fast: ['warning-min-test-2'] }).length).toBe(0);
  });
});
