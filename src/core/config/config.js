/**
 * @fileoverview Sentinal Config file logic.
 *
 */

'use strict';

const path = require('path');
const fs = require('fs');
const cosmiconfig = require('cosmiconfig');

const ConfigFileNotFoundError = require('../errors/exceptions/config-file-not-found-error');
const ConfigFilePathNotFoundError = require('../errors/exceptions/config-file-path-not-found-error');
const ConfigFileValidationError = require('../errors/exceptions/config-file-validation-error');

const configFileSchema = require('./data/config-file-schema.json');
const SchemaValidator = require('./schema-validator');

const MODULE_NAME = 'sentinal';

class Config {
  constructor(filePath = null, fileExplorer = null) {
    this._config = null;

    // this._configFileExplorer = fileExplorer ? fileExplorer : cosmiconfig(MODULE_NAME);

    // if(filePath) {
    //   if(fs.stat(filePath))
    // }
  }

  getPlugins() {
    if (this._config && this._config.config) {
      return this._config.config.plugins;
    }

    return [];
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
      console.log(this._configFileExplorer);

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
    const schemaValidator = new SchemaValidator(configFileSchema, config);

    if (!schemaValidator.isValid()) {
      const schemaErrors = schemaValidator.getOutputFormattedErrors();
      throw new ConfigFileValidationError('Invalid Sentinal Configuration file', configFilePath, schemaErrors);
    }

    return config;
  }
}

module.exports = Config;
