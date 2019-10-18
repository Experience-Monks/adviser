'use strict';

const path = require('path');
const cosmiconfig = require('cosmiconfig');
const Config = require('../../src/core/config/config');
const ConfigFileValidationError = require('../../src/core/errors/exceptions/config-file-validation-error');

describe('Config', () => {
  test('Load config with invalid schema', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {},
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    expect(() => {
      config.load('test');
    }).toThrow(ConfigFileValidationError);
  });

  test('Load config with valid schema', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1'],
          rules: {
            test1: 'warn'
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    expect(config.load('test')).toMatchObject({ plugins: ['test1'], rules: { test1: 'warn' } });
  });

  test('Look at for config with invalid schema', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.searchSync = jest.fn(() => {
      return {
        config: {},
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    expect(() => {
      config.search('test');
    }).toThrow(ConfigFileValidationError);
  });

  test('Look at for config with valid schema', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.searchSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1'],
          rules: {
            test1: 'warn'
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    expect(config.search('test')).toMatchObject({ plugins: ['test1'], rules: { test1: 'warn' } });
  });

  test('Get empty plugins', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1', 'test2', 'test3'],
          rules: {
            test1: 'warn'
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    expect(config.getPlugins()).toMatchObject([]);
  });

  test('Get plugins', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1', 'test2', 'test3'],
          rules: {
            test1: 'warn'
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    config.load('test');

    expect(config.getPlugins()).toMatchObject([{ id: 'test1' }, { id: 'test2' }, { id: 'test3' }]);
  });

  test('Get rules', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1', 'test2', 'test3'],
          rules: {
            'test1/rule': 'warn',
            'test2/rule': ['error', { test: 'test' }]
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    config.load('test');

    expect(config.getRules()).toMatchObject({
      'test1/rule': 'warn',
      'test2/rule': ['error', { test: 'test' }]
    });
  });

  test('Instantiate config with file exact path', () => {
    const testFile = path.join(process.cwd(), '/__tests__/core/config.test.js');
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1', 'test2', 'test3'],
          rules: {
            'test1/rule': 'warn',
            'test2/rule': ['error', { test: 'test' }]
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(testFile, fileExplorer);
    config.getRules();

    expect(fileExplorer.loadSync.mock.calls.length).toBe(1);
  });

  test('Instantiate config with file directory', () => {
    const testDirectory = process.cwd();
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.searchSync = jest.fn(() => {
      return {
        config: {
          plugins: ['test1', 'test2', 'test3'],
          rules: {
            'test1/rule': 'warn',
            'test2/rule': ['error', { test: 'test' }]
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(testDirectory, fileExplorer);
    config.getRules();

    expect(fileExplorer.searchSync.mock.calls.length).toBe(1);
  });
});

describe('Settings', () => {
  test('Get full settings', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          },
          settings: {
            test: {},
            another: 3
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    config.load('test');

    expect(config.getSettings()).toMatchObject({
      test: {},
      another: 3
    });
  });

  test('Get empty settings', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    config.load('test');

    expect(config.getSettings()).toMatchObject({});
  });

  test('Get tags from empty settings', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    config.load('test');

    expect(config.getTags()).toMatchObject({});
  });

  test('Get non existing tags in settings', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          },
          settings: {
            tagg: 3
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);

    config.load('test');

    expect(config.getTags()).toMatchObject({});
  });

  test('Get invalid existing tags in settings', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          },
          settings: {
            tags: 3
          }
        },
        filePath: 'test'
      };
    });

    expect(() => {
      const config = new Config(null, fileExplorer);
      config.load('test');
      config.getTags();
    }).toThrow(ConfigFileValidationError);
  });

  test('Return valid empty tags', () => {
    const fileExplorer = cosmiconfig('adviser');

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          },
          settings: {
            tags: {}
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);
    config.load('test');

    expect(config.getTags()).toMatchObject({});
  });

  test('Return valid tags', () => {
    const fileExplorer = cosmiconfig('adviser');
    const tags = {
      quick: ['root-files'],
      'dependencies-change': ['rule1', 'rule2']
    };

    fileExplorer.loadSync = jest.fn(() => {
      return {
        config: {
          rules: {
            'test1/rule': 'warn'
          },
          settings: {
            tags
          }
        },
        filePath: 'test'
      };
    });
    const config = new Config(null, fileExplorer);
    config.load('test');

    expect(config.getTags()).toMatchObject(tags);
  });
});
