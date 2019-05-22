'use strict';

const logger = require('../../src/utils/logger');

describe('Print expected message', () => {
  test('Check if it prints a number', () => {
    const expectedOutput = '4';

    let output = '';
    function storeLog(inputs) {
      output += inputs;
    }
    // eslint-disable-next-line
    console['log'] = jest.fn(storeLog.bind(this));

    logger.info(4);

    expect(output).toBe(expectedOutput);
  });

  test('Check if it prints a string', () => {
    const expectedOutput = `This is a test ${Date.now()}`;

    let output = '';
    function storeLog(inputs) {
      output += inputs;
    }
    // eslint-disable-next-line
    console['error'] = jest.fn(storeLog.bind(this));

    logger.error(expectedOutput);

    expect(output).toBe(expectedOutput);
  });
});
