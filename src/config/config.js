/**
 * @fileoverview Sentinal Config file logic.
 *
 */

'use strict';

const path = require('path');
const cosmiconfig = require('cosmiconfig');

const ConfigFileNotFoundError = require('../exceptions/configFileNotFoundError');
const ConfigFilePathNotFoundError = require('../exceptions/configFilePathNotFoundError');

const ConfigValidator = require('./config-validator');
const logger = require('../utils/logger');

const MODULE_NAME = 'sentinal';

class Config {
  constructor(currentDirectory, configFilePath) {
    this._configFileExplorer = cosmiconfig(MODULE_NAME);
    let foundConfigFile = null;

    if (configFilePath) {
      foundConfigFile = this.loadConfigFileFromPath(configFilePath);
    } else {
      foundConfigFile = this.searchConfigFile(currentDirectory);
    }

    logger.info(foundConfigFile.config);

    const configValidator = new ConfigValidator(foundConfigFile.config, foundConfigFile.filepath);
    configValidator.validate();
  }

  loadConfigFileFromPath(exactPath) {
    try {
      return this._configFileExplorer.loadSync(exactPath);
    } catch (error) {
      let targetDirectory = error.path;
      if (!targetDirectory) {
        targetDirectory = path.resolve(exactPath);
      }

      throw new ConfigFilePathNotFoundError(targetDirectory);
    }
  }

  searchConfigFile(initialPath) {
    try {
      return this._configFileExplorer.searchSync(initialPath);
    } catch (error) {
      let targetDirectory = error.path;
      if (!targetDirectory) {
        targetDirectory = path.resolve(initialPath);
      }

      throw new ConfigFileNotFoundError(null, targetDirectory);
    }
  }
}

module.exports = Config;
