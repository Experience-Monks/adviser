/**
 * @fileoverview Adviser package info
 *
 */

'use strict';

module.exports = {
  /**
   * Get Adviser package version
   * @returns {Number} package version
   */
  getVersion() {
    const pkg = require('../package.json');
    return pkg.version;
  }
};
