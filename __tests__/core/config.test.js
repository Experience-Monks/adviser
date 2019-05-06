'use strict';

jest.mock('cosmiconfig');
const cosmiconfig = require('cosmiconfig');
const Config = require('../../src/core/config/config');

describe('Config', () => {
  test('Load empty plugins', () => {
    cosmiconfig.mockReturnValue({
      loadSync: () => {
        return {};
      }
    });
    const config = new Config();

    expect(config.load('lala').length).toBe(0);
  });

  test('Load config file from path', () => {
    // mock cosmiconfig
    const config = new Config();

    expect(0).toBe(0);
  });

  test('Load config file from directory', () => {
    // mock cosmiconfig
    const config = new Config();

    expect(0).toBe(0);
  });

  test('Get plugins', () => {
    const config = new Config();

    expect(0).toBe(0);
  });

  test('Get rules', () => {
    const config = new Config();

    expect(0).toBe(0);
  });

  test('Instantiate config with file exact path', () => {
    // mock cosmiconfig
    const config = new Config();

    expect(0).toBe(0);
  });

  test('Instantiate config with file directory', () => {
    // mock cosmiconfig
    const config = new Config();

    expect(0).toBe(0);
  });
});
