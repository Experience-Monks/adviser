'use strict';

const SchemaValidator = require('../../src/core/config/schema-validator');
const configFileSchema = require('../../src/core/config/data/config-file-schema.json');
const fullSampleConfigFile = require('../../src/core/config/data/sample-config-file.json');

describe('Schema Validator', () => {
  test('Valid config file with all the possible options', () => {
    const configFile = fullSampleConfigFile;
    const schemaValidator = new SchemaValidator(configFileSchema, configFile);

    expect(schemaValidator.isValid()).toBe(true);
  });

  test('Valid config file without extends and settings', () => {
    const configFile = {
      plugins: ['plugin1', 'plugin2'],
      rules: {
        exampleWarnRule: 'warn'
      }
    };
    const schemaValidator = new SchemaValidator(configFileSchema, configFile);

    expect(schemaValidator.isValid()).toBe(true);
  });

  test("Missing plugin property can't return an error", () => {
    const configFile = {
      rules: {
        exampleWarnRule: 'warn'
      }
    };
    const schemaValidator = new SchemaValidator(configFileSchema, configFile);

    expect(schemaValidator.isValid()).toBe(true);
  });

  test('At leats one plugin is required', () => {
    const configFile = {
      plugins: [],
      rules: {
        exampleWarnRule: 'warn'
      }
    };
    const schemaValidator = new SchemaValidator(configFileSchema, configFile);

    expect(schemaValidator.isValid()).toBe(false);
  });

  test('Missing rules property must return an error', () => {
    const configFile = {
      plugins: ['test']
    };
    const schemaValidator = new SchemaValidator(configFileSchema, configFile);

    expect(schemaValidator.isValid()).toBe(false);
  });

  test('At leats one rule is required', () => {
    const configFile = {
      plugins: ['plugin1'],
      rules: {}
    };
    const schemaValidator = new SchemaValidator(configFileSchema, configFile);

    expect(schemaValidator.isValid()).toBe(false);
  });
});
