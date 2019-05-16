/**
 * @fileoverview Sentinal Config file logic.
 *
 */

'use strict';

const path = require('path');
const fs = require('fs');
const cosmiconfig = require('cosmiconfig');
const debug = require('debug')('sentinal:config');

const ConfigFileNotFoundError = require('../errors/exceptions/config-file-not-found-error');
const ConfigFilePathNotFoundError = require('../errors/exceptions/config-file-path-not-found-error');
const ConfigFileValidationError = require('../errors/exceptions/config-file-validation-error');

const configFileSchema = require('./data/config-file-schema.json');
const SchemaValidator = require('./schema-validator');

const MODULE_NAME = 'sentinal';

class Config {
  constructor(filePath = null, fileExplorer = null) {
    this._config = null;

    this._configFileExplorer = fileExplorer || cosmiconfig(MODULE_NAME);

    if (filePath) {
      const filePathInfo = fs.statSync(filePath);

      if (filePathInfo.isDirectory()) {
        this.search(filePath);
      } else {
        this.load(filePath);
      }
    }
  }

  /**
   * Return the plugins defined in the config file
   *
   * @returns {Array}
   * @memberof Config
   */
  getPlugins() {
    if (this._config && this._config.config) {
      return this._config.config.plugins;
    }

    return [];
  }

  /**
   * Return the rules defined in the config file
   *
   * @returns {Array}
   * @memberof Config
   */
  getRules() {
    if (this._config && this._config.config) {
      return this._config.config.rules;
    }

    return {};
  }

  /**
   * Load Configuration file from path
   *
   * @param {Path} exactPath
   * @returns
   * @memberof Config
   */
  load(exactPath) {
    try {
      this._config = this._configFileExplorer.loadSync(exactPath);
    } catch (error) {
      let targetDirectory = error.path;
      if (!targetDirectory) {
        targetDirectory = path.resolve(exactPath);
      }

      throw new ConfigFilePathNotFoundError(targetDirectory);
    }

    return this._validateSchema(this._config.config, this._config.filepath);
  }

  /**
   * Search for a config file in a directory
   *
   * @param {Path} directory
   * @returns
   * @memberof Config
   */
  search(directory) {
    try {
      this._config = this._configFileExplorer.searchSync(directory);
    } catch (error) {
      let targetDirectory = error.path;
      if (!targetDirectory) {
        targetDirectory = path.resolve(directory);
      }

      throw new ConfigFileNotFoundError(null, targetDirectory);
    }

    return this._validateSchema(this._config.config, this._config.filepath);
  }

  /**
   * Is the loaded config file valid
   *
   * @param {Sentinal Config File} config
   * @param {Path} configFilePath
   * @memberof Config
   */
  _validateSchema(config, configFilePath) {
    debug(`Config file loaded, validating schema`);
    const schemaValidator = new SchemaValidator(configFileSchema, config);

    if (!schemaValidator.isValid()) {
      const schemaErrors = schemaValidator.getOutputFormattedErrors();
      throw new ConfigFileValidationError('Invalid Sentinal Configuration file', configFilePath, schemaErrors);
    }

    return config;
  }
}

module.exports = Config;
