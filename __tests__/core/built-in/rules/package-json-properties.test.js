'use strict';

const PackageJsonRule = require('../../../../src/core/built-in/rules/package-json-properties');

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

  test("Load rule with required argument doesn't throw errors", () => {
    const context = {
      options: {
        required: ['test']
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
    }).not.toThrow();
  });

  test("Load rule with blacklist argument doesn't throw errors", () => {
    const context = {
      options: {
        blacklist: ['test']
      }
    };

    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const packageJsonRule = new PackageJsonRule(context);
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
      const packageJsonRule = new PackageJsonRule(context);
    }).toThrow();
  });

  test('Invalid arguments of rule blacklist throw an error', () => {
    const context = {
      options: {
        blacklist: 'test'
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
        blacklist: ['not-allowed'],
        required: ['required']
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
    packageJsonRule._getPackageJsonPath = jest.fn(() => {
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
        required: ['required']
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
    packageJsonRule._getPackageJsonPath = jest.fn(() => {
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
        blacklist: ['not-allowed']
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
    packageJsonRule._getPackageJsonPath = jest.fn(() => {
      return {
        another: [],
        'not-allowed': true
      };
    });

    packageJsonRule.run(sandbox);

    expect(mockFunction.mock.calls.length).toBe(1);
  });
});
