'use strict';

const PackageJsonRule = require('../../../src/core/built-in/rules/package-json-properties');

describe('Built in package-json-properties rule - Validation', () => {
  test('Load rule without argument throws an error', () => {
    const context = {
      options: {}
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
    }).toThrow();
  });

  test("Load rule with require-props argument doesn't throw errors", () => {
    const context = {
      options: {
        'require-props': ['test']
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
    }).not.toThrow();
  });

  test("Load rule with not-allowed-props argument doesn't throw errors", () => {
    const context = {
      options: {
        'not-allowed-props': ['test']
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
    }).not.toThrow();
  });

  test('Invalid arguments of rule require-props throw an error', () => {
    const context = {
      options: {
        'require-props': 'test'
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
    }).toThrow();
  });

  test('Invalid arguments of rule not-allowed-props throw an error', () => {
    const context = {
      options: {
        'not-allowed-props': 'test'
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
    }).toThrow();
  });
});

describe('Built in package-json-properties rule - Execution', () => {
  test('No missing required properties and not including any restricted property', () => {
    const context = {
      options: {
        'not-allowed-props': ['not-allowed'],
        'require-props': ['required']
      },
      filesystem: {
        dirname: ''
      }
    };
    const mockFunction = jest.fn(() => {});
    const sandbox = {
      report: mockFunction
    };

    const packageJsonRule = new PackageJsonRule(context);
    packageJsonRule.getPackageJsonPath = jest.fn(() => {
      return {
        required: []
      };
    });

    packageJsonRule.run(sandbox);

    expect(mockFunction.mock.calls.length).toBe(0);
  });

  test('Missing required properties', () => {
    const context = {
      options: {
        'require-props': ['required']
      },
      filesystem: {
        dirname: ''
      }
    };
    const mockFunction = jest.fn(() => {});
    const sandbox = {
      report: mockFunction
    };

    const packageJsonRule = new PackageJsonRule(context);
    packageJsonRule.getPackageJsonPath = jest.fn(() => {
      return {
        another: []
      };
    });

    packageJsonRule.run(sandbox);

    expect(mockFunction.mock.calls.length).toBe(1);
  });

  test('Including restricted properties', () => {
    const context = {
      options: {
        'not-allowed-props': ['not-allowed']
      },
      filesystem: {
        dirname: ''
      }
    };
    const mockFunction = jest.fn(() => {});
    const sandbox = {
      report: mockFunction
    };

    const packageJsonRule = new PackageJsonRule(context);
    packageJsonRule.getPackageJsonPath = jest.fn(() => {
      return {
        another: [],
        'not-allowed': true
      };
    });

    packageJsonRule.run(sandbox);

    expect(mockFunction.mock.calls.length).toBe(1);
  });
});
