/**
 * @fileoverview CLI init.
 *
 */

'use strict';

const fs = require('fs');

const chalk = require('chalk');
const debug = require('debug')('adviser:cli-init');

const logger = require('../utils/logger');

/**
 * Create init configuration file based on an internal template
 *
 */
function createTemplate() {
  debug(`Creating file .adviserrc in the path ${process.cwd()}`);
  const adviserInitConfigFileTemplate = require('../core/config/data/init-config-file-template.json');
  fs.writeFile('.adviserrc', JSON.stringify(adviserInitConfigFileTemplate, null, 4), function (err) {
    if (err) throw err;
    logger.info(
      `Adviser created a base configuration file called ${chalk.yellow('.adviserrc')} with the following structure:`
    );

    logger.info(adviserInitConfigFileTemplate);
  });
}

module.exports = {
  createTemplate,
};
