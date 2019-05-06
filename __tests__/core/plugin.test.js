'use strict';

const Plugins = require('../../src/core/config/plugins');
const PluginError = require('../../src/core/errors/exceptions/plugin-error');

describe('Plugins', () => {
  test('Add empty plugin', () => {
    const plugins = new Plugins();

    const ruleName = '';
    expect(() => {
      plugins.add(ruleName, {}, {});
    }).not.toThrow();
  });

  test('Add and get plugin', () => {
    const plugins = new Plugins();

    const pluginName = 'security-audit';

    plugins.add(pluginName, {});
    expect(plugins.get(pluginName)).toBeDefined();
  });

  test('Get many plugins', () => {
    const plugins = new Plugins();

    for (let index = 0; index < 5; index++) {
      plugins.add(`warning-min-test-${index}`, {}, {});
    }

    expect(plugins.getAll().size).toBe(5);
  });

  test('Get short Plugin ID', () => {
    const plugins = new Plugins();

    const pluginName = 'security-audit';

    expect(plugins._normalizePluginId(pluginName)).toBe(`${plugins._pluginScope}${pluginName}`);
  });

  test('Get short Rule ID with scope', () => {
    const plugins = new Plugins();

    const pluginName = 'sentinal-plugin-security-audit';

    expect(plugins._normalizePluginId(pluginName)).toBe(pluginName);
  });

  test('Load plugin with whitespaces', () => {
    const plugins = new Plugins();
    function load() {
      plugins.load(pluginName, '');
    }

    const pluginName = 'sentinal-plugin-secu rity-audit';

    expect(load).toThrow(PluginError);
    expect(load).toThrow('Invalid plugin name');
  });

  test('Load plugin with invalid location', () => {
    const plugins = new Plugins();
    function load() {
      plugins.load(pluginName, '');
    }

    const pluginName = 'sentinal-plugin-security-audit';

    expect(load).toThrow(PluginError);
    expect(load).toThrow('Failed to load plugin');
  });

  test('Load plugin', () => {
    const pluginName = 'sentinal-plugin-security-audit';
    const plugins = new Plugins();

    plugins._loadFromDirectory = jest.fn(() => {
      return {
        plugin: 'data'
      };
    });

    plugins.load(pluginName, '');

    expect(plugins.get(pluginName)).toMatchObject({
      plugin: 'data'
    });
  });

  test('Get all the rules', () => {
    const pluginNameFirst = 'sentinal-plugin-security-audit';
    const pluginNameSecond = 'sentinal-plugin-security-audit-second';
    const plugins = new Plugins();

    plugins._loadFromDirectory = jest.fn(() => {
      return {
        rules: {
          'min-vulnerabilities-allowed': {
            create: () => {
              console.log('min-vulnerabilities-allowed');
            }
          },
          'min-vulnerabilities-allowed-1': {
            create: () => {
              console.log('min-vulnerabilities-allowed-1');
            }
          }
        }
      };
    });

    plugins.load(pluginNameFirst, '');
    plugins.load(pluginNameSecond, '');

    const rules = plugins.getAllRules();

    expect(rules.size).toBe(4);
  });
});
