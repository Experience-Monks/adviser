'use strict';

const plugins = require('../../src/core/config/plugins');
const PluginError = require('../../src/core/errors/exceptions/plugin-error');

const AdviserRule = require('../../src/core/external/rule');
class MockAdviserRule extends AdviserRule {}

describe('Plugins', () => {
  beforeEach(() => {
    plugins.reset();
  });

  test('Add empty plugin', () => {
    const ruleName = '';
    expect(() => {
      plugins.add(ruleName, {}, {});
    }).not.toThrow();
  });

  test('Add and get plugin', () => {
    const pluginName = 'security-audit';

    plugins.add(pluginName, {});
    expect(plugins.get(pluginName)).toBeDefined();
  });

  test('Get many plugins', () => {
    for (let index = 0; index < 5; index++) {
      plugins.add({ id: `warning-min-test-${index}` }, {}, {});
    }

    expect(Object.keys(plugins.getAll()).length).toBe(5);
  });

  test('Get short Plugin ID', () => {
    const pluginName = 'security-audit';

    expect(plugins._normalizePluginId(pluginName)).toBe(`${plugins._pluginScope}${pluginName}`);
  });

  test('Get short Rule ID with scope', () => {
    const pluginName = 'adviser-plugin-security-audit';

    expect(plugins._normalizePluginId(pluginName)).toBe(pluginName);
  });

  test('Load plugin with whitespaces', () => {
    function load() {
      plugins.load(pluginName, '');
    }

    const pluginName = { id: 'adviser-plugin-secu rity-audit' };

    expect(load).toThrow(PluginError);
    expect(load).toThrow('Invalid plugin name');
  });

  test('Load plugin with invalid location', () => {
    function load() {
      plugins.load(pluginName, '');
    }

    const pluginName = { id: 'adviser-plugin-security-audit' };

    expect(load).toThrow(PluginError);
    expect(load).toThrow('Failed to load plugin');
  });

  test('Load plugin', () => {
    const pluginName = 'adviser-plugin-security-audit';

    plugins._loadFromDirectory = jest.fn(() => {
      return {
        plugin: 'data'
      };
    });

    plugins.load({ id: pluginName }, '');

    expect(plugins.get(pluginName)).toMatchObject({
      plugin: 'data'
    });
  });

  test('Get all the rules', () => {
    const pluginNameFirst = 'adviser-plugin-security-audit';
    const pluginNameSecond = 'adviser-plugin-security-audit-second';

    plugins._loadFromDirectory = jest.fn(() => {
      return {
        rules: {
          'min-vulnerabilities-allowed': MockAdviserRule,
          'min-vulnerabilities-allowed-1': MockAdviserRule
        }
      };
    });

    plugins.load({ id: pluginNameFirst }, '');
    plugins.load({ id: pluginNameSecond }, '');

    const rules = plugins.getAllRules();

    expect(rules.size).toBe(4);
  });
});
