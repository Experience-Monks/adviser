/**
 * @fileoverview Adviser Config file logic.
 *
 */

'use strict';

const path = require('path');
const fs = require('fs');

const { cosmiconfig } = require('cosmiconfig');
const debug = require('debug')('adviser:config');

const ConfigFileNotFoundError = require('../errors/exceptions/config-file-not-found-error');
const ConfigFilePathNotFoundError = require('../errors/exceptions/config-file-path-not-found-error');
const ConfigFileValidationError = require('../errors/exceptions/config-file-validation-error');
const configFileSchema = require('./data/config-file-schema.json');
const SchemaValidator = require('./schema-validator');

const MODULE_NAME = 'adviser';

/**
 * Class to handle the configuration files
 *
 * @class Config
 */
class Config {
  /**
   *Creates an instance of Config.
   * @param {String} [filePath=null] File path of the config file
   * @param {FileExplorer} [fileExplorer=null] By default using cosmiconfig, but can be any explorer with the same API
   * @memberof Config
   */
  constructor(filePath = null, fileExplorer = null) {
    this._config = null;

    this._configFileExplorer = fileExplorer || cosmiconfig(MODULE_NAME);

    if (filePath) {
      let filePathInfo = '';
      try {
        filePathInfo = fs.statSync(filePath);
      } catch (error) {
        debug(`Found an error in the path`, error);
        throw new ConfigFileNotFoundError(null, filePath);
      }

      if (filePathInfo.isDirectory()) {
        debug(`Looking for the configuration file in the directory ${filePath} and in the parent directories`);
        this.search(filePath);
      } else {
        debug(`Looking for the configuration file in the path ${filePath}`);
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
    if (this._config && this._config.config && this._config.config.plugins) {
      return this._config.config.plugins.map(plugin => {
        const extendedPlugin = { id: plugin, settings: {} };

        if (this._config.config.settings && this._config.config.settings[plugin]) {
          extendedPlugin.settings = this._config.config.settings[plugin];
        }

        return extendedPlugin;
      });
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
   * Return the settings defined in the config file
   *
   * @returns {Array}
   * @memberof Config
   */
  getSettings() {
    if (this._config && this._config.config && this._config.config.settings) {
      return this._config.config.settings;
    }

    return {};
  }

  /**
   * Return the tags settings defined in the config file
   *
   * @returns {Array}
   * @memberof Config
   */
  getTags() {
    return Object.prototype.hasOwnProperty.call(this.getSettings(), 'tags') ? this.getSettings().tags : {};
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

      debug(`Couldn't find the config file`, error);
      throw new ConfigFilePathNotFoundError(targetDirectory);
    }

    if (!this._config) {
      throw new ConfigFileNotFoundError(null, exactPath);
    }

    return this._validateSchema(this._config.config, this._config.filepath);
    // TODO: Validate the rules names have the format [plugin name]/[rule id] and move the checking from the engine to here
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

      debug(`Couldn't find the config file`, error);
      throw new ConfigFileNotFoundError(null, targetDirectory);
    }

    if (!this._config) {
      throw new ConfigFileNotFoundError(null, directory);
    }

    return this._validateSchema(this._config.config, this._config.filepath);
  }

  /**
   * Is the loaded config file valid
   *
   * @param {Adviser Config File} config
   * @param {Path} configFilePath
   * @memberof Config
   */
  _validateSchema(config, configFilePath) {
    debug(`Config file loaded from ${configFilePath}`);
    debug(`Validating config file schema`);
    const schemaValidator = new SchemaValidator(configFileSchema, config);

    if (!schemaValidator.isValid()) {
      const schemaErrors = schemaValidator.getOutputFormattedErrors();
      throw new ConfigFileValidationError('Invalid Adviser Configuration file', configFilePath, schemaErrors);
    }

    return config;
  }
}

module.exports = Config;
