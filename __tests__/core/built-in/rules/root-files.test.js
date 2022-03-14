'use strict';

const RootFileRule = require('../../../../src/core/built-in/rules/root-files');

describe('Built in root-files rule - Validation', () => {
  test('Load rule without argument throws an error', () => {
    const context = {
      options: {}
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const rootFileRule = new RootFileRule(context);
    }).toThrow();
  });

  test("Load rule with required argument doesn't throw errors", () => {
    const context = {
      options: {
        required: ['test']
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const rootFileRule = new RootFileRule(context);
    }).not.toThrow();
  });

  test("Load rule with blocklist argument doesn't throw errors", () => {
    const context = {
      options: {
        blocklist: ['test']
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const rootFileRule = new RootFileRule(context);
    }).not.toThrow();
  });

  test('Invalid arguments of rule required throw an error', () => {
    const context = {
      options: {
        required: 'test'
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const rootFileRule = new RootFileRule(context);
    }).toThrow();
  });

  test('Invalid arguments of rule blocklist throw an error', () => {
    const context = {
      options: {
        blocklist: 'test'
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const rootFileRule = new RootFileRule(context);
    }).toThrow();
  });
});

describe('Built in root-files rule - Execution', () => {
  test('No missing required files and not including any restricted files', async () => {
    const context = {
      options: {
        blocklist: ['.hack-u'],
        required: ['.eslintrc']
      },
      filesystem: {
        dirname: ''
      }
    };
    const mockFunction = jest.fn(() => {});
    const sandbox = {
      report: mockFunction
    };

    const rootFileRule = new RootFileRule(context);
    rootFileRule._readRootDirectory = jest.fn(() => {
      return ['.eslintrc'];
    });

    await rootFileRule.run(sandbox);
    expect(mockFunction.mock.calls.length).toBe(0);
  });

  test('Missing required properties', async () => {
    const context = {
      options: {
        required: ['required.js']
      },
      filesystem: {
        dirname: ''
      }
    };
    const mockFunction = jest.fn(() => {});
    const sandbox = {
      report: mockFunction
    };

    const rootFileRule = new RootFileRule(context);
    rootFileRule._readRootDirectory = jest.fn(() => {
      return ['other'];
    });

    await rootFileRule.run(sandbox);
    expect(mockFunction.mock.calls.length).toBe(1);
  });

  test('Including restricted properties', async () => {
    const context = {
      options: {
        blocklist: ['not-allowed.js']
      },
      filesystem: {
        dirname: ''
      }
    };
    const mockFunction = jest.fn(() => {});
    const sandbox = {
      report: mockFunction
    };

    const rootFileRule = new RootFileRule(context);
    rootFileRule._readRootDirectory = jest.fn(() => {
      return ['not-allowed.js'];
    });

    await rootFileRule.run(sandbox);
    expect(mockFunction.mock.calls.length).toBe(1);
  });
});
