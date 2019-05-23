/**
 * @fileoverview Sentinal Config file Schema Validator.
 *
 */

'use strict';

const debug = require('debug')('sentinal:schema-validator');

const Ajv = require('ajv');

/**
 * Validates the config file schema
 *
 * @class SchemaValidator
 */
class SchemaValidator {
  /**
   *Creates an instance of SchemaValidator.
   * @param {JSON} schema Schema used to validate the config file
   * @param {JSON} config Config file to test
   * @memberof SchemaValidator
   */
  constructor(schema, config) {
    this.config = config;
    this.schema = schema;

    this.ajv = new Ajv({
      meta: false,
      useDefaults: true,
      validateSchema: false,
      missingRefs: 'ignore',
      verbose: true,
      schemaId: 'auto'
    });
  }

  /**
   * Is the config file valid based on the schema
   *
   * @returns Boolean
   * @memberof SchemaValidator
   */
  isValid() {
    const isValid = this.ajv.validate(this.schema, this.config);
    debug(`Schema validation is ${!isValid && 'not'} valid`);
    return isValid;
  }

  /**
   * Get raw errors from the schema validation process
   *
   * @returns String
   * @memberof SchemaValidator
   */
  getSchemaErrors() {
    return this.ajv.errors;
  }

  /**
   * Get formatted errors for output
   *
   * @returns String
   * @memberof SchemaValidator
   */
  getOutputFormattedErrors() {
    return this._formatSchemaErrors(this.ajv.errors);
  }

  /**
   * Parse schema validation errors and produces a string output
   *
   * @param {AJV Error Instance} errors
   * @returns {String}
   * @memberof SchemaValidator
   */
  _formatSchemaErrors(errors) {
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

module.exports = SchemaValidator;
