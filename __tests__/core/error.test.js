'use strict';

const errorHandler = require('../../src-refactor/core/errors/error-handler');

// TODO: Fill the test

describe('Print expected message', () => {
  test('Base error print in the console', () => {
    const sampleError = new Error();

    errorHandler(sampleError);

    expect(1).toBe(1);
  });

  test('Custom error loads message', () => {
    const sampleError = new Error();

    errorHandler(sampleError);

    expect(1).toBe(1);
  });
});
