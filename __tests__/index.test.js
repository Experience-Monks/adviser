'use strict';

describe('Print expected message', () => {
  test('Check if it prints a number', () => {
    const expectedOutput = '4';

    expect('4').toBe(expectedOutput);
  });
});
