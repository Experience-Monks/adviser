'use strict';

const print = require('../src');

describe('Print expected message', () => {
  test('Check if it prints a number', () => {
    const expectedOutput = '4';

    let output = '';
    function storeLog(inputs) {
      output += inputs;
    }
    console['log'] = jest.fn(storeLog.bind(this));

    print(4);

    expect(output).toBe(expectedOutput);
  });

  test('Check if it prints a string', () => {
    const expectedOutput = `This is a test ${Date.now()}`;

    let output = '';
    function storeLog(inputs) {
      output += inputs;
    }
    console['log'] = jest.fn(storeLog.bind(this));

    print(expectedOutput);

    expect(output).toBe(expectedOutput);
  });
});

describe('Throw an exception with unsupported values', () => {
  test('Check if it throws an exception with OBJECTS', () => {
    const input = { test: 3 };

    expect(() => {
      print(input);
    }).toThrow('The argument is not a string or a number');
  });

  test('Check if it throws an exception with ARRAYS', () => {
    const input = ['test', 5];

    expect(() => {
      print(input);
    }).toThrow('The argument is not a string or a number');
  });

  test('Check if it throws an exception with FUNCTIONS', () => {
    const input = () => console.log('test');

    expect(() => {
      print(input);
    }).toThrow('The argument is not a string or a number');
  });
});
