/**
 * @fileoverview Sentinal Config file Validator.
 *
 */

'use strict';

const Ajv = require('ajv');

const ConfigFileValidationError = require('../exceptions/configFileValidationError');
const configFileSchema = require('./config-file-schema.json');

class ConfigValidator {
  constructor(config, configFilePath) {
    this.config = config;
    this.configFilePath = configFilePath;

    this.ajv = new Ajv({
      meta: false,
      useDefaults: true,
      validateSchema: false,
      missingRefs: 'ignore',
      verbose: true,
      schemaId: 'auto'
    });
  }

  validate() {
    this.validateConfigSchema();
    // Load Plugins - validate if they exist
    // Load Extends - validate if they exist and merge
    // TODO: validate Rules (global format, call plugin for custom validation)
  }

  validateConfigSchema() {
    var valid = this.ajv.validate(configFileSchema, this.config);
    if (!valid) {
      const formattedErrors = this.formatSchemaErrors(this.ajv.errors);
      throw new ConfigFileValidationError('Invalid Sentinal Configuration file', this.configFilePath, formattedErrors);
    }
  }

  formatSchemaErrors(errors) {
    const filteredRules = [];

    return errors
      .map(error => {
        if (error.dataPath.indexOf('.rules[') >= 0) {
          const field = error.dataPath[0] === '.' ? error.dataPath.slice(7, -1) : error.dataPath;

          if (filteredRules.includes(error.dataPath)) {
            return;
          }

          filteredRules.push(error.dataPath);
          return `Rule ${field} has an invalid value "${error.data}", replace it with a valid severity value`;
        }

        if (error.keyword === 'additionalProperties') {
          const formattedPropertyPath = error.dataPath.length
            ? `${error.dataPath.slice(1)}.${error.params.additionalProperty}`
            : error.params.additionalProperty;

          return `Unexpected top-level property "${formattedPropertyPath}"`;
        }
        if (error.keyword === 'type') {
          const formattedField = error.dataPath.slice(1);
          const formattedExpectedType = Array.isArray(error.schema) ? error.schema.join('/') : error.schema;
          const formattedValue = JSON.stringify(error.data);

          return `Property "${formattedField}" is the wrong type (expected ${formattedExpectedType} but got \`${formattedValue}\`)`;
        }

        if (error.keyword === 'enum') {
          const field = error.dataPath[0] === '.' ? error.dataPath.slice(1) : error.dataPath;

          return `"${field}" ${error.message} [${error.params.allowedValues}]`;
        }

        const field = error.dataPath[0] === '.' ? error.dataPath.slice(1) : error.dataPath;

        return `"${field}" ${error.message}. Value: ${JSON.stringify(error.data)}`;
      })
      .filter(message => message)
      .map(message => `\t- ${message}.\n`)
      .join('');
  }
}

module.exports = ConfigValidator;
