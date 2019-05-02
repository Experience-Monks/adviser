/**
 * @fileoverview Sentinal engine core
 *
 */

'use strict';

module.exports = {
  /**
   * Get Sentinal package version
   * @returns {Number} package version
   */
  getVersion() {
    const pkg = require('../../package.json');
    return pkg.version;
  }
};
