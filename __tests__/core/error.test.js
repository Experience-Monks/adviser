'use strict';

const logger = require('../../src/utils/logger');
const templateLoader = require('../../src/core/errors/template-loader');
const errorHandler = require('../../src/core/errors/error-handler');

const errorProcessExitCode = 2;

describe('Print expected message', () => {
  test('Base error print in the console', () => {
    const sampleError = new Error();

    logger.error = jest.fn();

    errorHandler(sampleError);

    expect(logger.error.mock.calls.length).toBe(1);
    expect(process.exitCode).toBe(errorProcessExitCode);
  });

  test("Custom error doesn't find the error template", () => {
    const sampleError = new Error();
    sampleError.messageTemplate = 'test';

    let output = '';
    function storeLog(inputs) {
      output += inputs;
    }

    logger.error = jest.fn(storeLog.bind(this));

    errorHandler(sampleError);

    expect(logger.error.mock.calls.length).toBe(2);
    expect(output).toEqual(expect.stringContaining(`The error template doesn't exist`));
    expect(process.exitCode).toBe(errorProcessExitCode);
  });

  test('Custom error loads message', () => {
    const templateCopy = 'this is the template';

    const sampleError = new Error();
    sampleError.messageTemplate = 'test';

    templateLoader.setTemplateId('test');
    templateLoader.exist = jest.fn(() => {
      return true;
    });
    templateLoader.load = jest.fn(() => () => templateCopy);

    let output = '';
    function storeLog(inputs) {
      output += inputs;
    }

    logger.error = jest.fn(storeLog.bind(this));

    errorHandler(sampleError);

    expect(logger.error.mock.calls.length).toBe(2);
    expect(output).toEqual(expect.stringContaining(templateCopy));
    expect(process.exitCode).toBe(errorProcessExitCode);
  });
});
