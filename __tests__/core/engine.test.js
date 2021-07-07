'use strict';

const { cosmiconfig } = require('cosmiconfig');

const AdviserRule = require('../../src/core/external/rule');

const Config = require('../../src/core/config/config');
const Engine = require('../../src/core/engine');

const plugins = require('../../src/core/config/plugins');

const InvalidRuleError = require('../../src/core/errors/exceptions/invalid-rule-error');

class MockAdviserRule extends AdviserRule {}

describe('Engine - Load Rules', () => {
  beforeEach(() => {
    plugins.reset();
  });

  test('Config rule is not in defined in plugins', () => {
    // Mock the config file
    const fileExplorer = cosmiconfig('adviser');
    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1'],
          rules: {
            'test1/rule': ['error', { test: 'test' }]
          }
        },
        filePath: 'test'
      };
    });

    const config = new Config(null, fileExplorer);
    config.load();

    // Mock plugin load
    plugins._loadFromDirectory = jest.fn(() => {
      return {
        rules: {
          'test2/rule': MockAdviserRule
        }
      };
    });

    function loadEngine() {
      const engine = new Engine(config, {});
      engine.rules.get('');
    }

    expect(loadEngine).toThrow(InvalidRuleError);
    expect(loadEngine).toThrow('Invalid rule definition');
  });

  test('Invalid rule name - not included the plugin', () => {
    // Mock the config file
    const fileExplorer = cosmiconfig('adviser');
    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1'],
          rules: {
            'rule-test': ['error', { test: 'test' }]
          }
        },
        filePath: 'test'
      };
    });

    const config = new Config(null, fileExplorer);
    config.load();

    // Mock plugin load
    plugins._loadFromDirectory = jest.fn(() => {
      return {
        rules: {
          'test2/rule': MockAdviserRule
        }
      };
    });

    function loadEngine() {
      const engine = new Engine(config, {});
      engine.rules.get('');
    }

    expect(loadEngine).toThrow(InvalidRuleError);
    expect(loadEngine).toThrow('Invalid rule name');
  });

  test('Rules are loaded', () => {
    // Mock the config file
    const fileExplorer = cosmiconfig('adviser');
    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1'],
          rules: {
            'test1/rule': ['error', { test: 'test' }]
          }
        },
        filePath: 'test'
      };
    });

    const config = new Config(null, fileExplorer);
    config.load();

    // Mock plugin load
    plugins._loadFromDirectory = jest.fn(() => {
      return {
        rules: {
          rule: MockAdviserRule
        }
      };
    });

    const engine = new Engine(config, {});

    expect(engine.rules.get('rule')).toBeDefined();
  });
});
