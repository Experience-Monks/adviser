/**
 * @fileoverview Formatter factory
 *
 */

'use strict';

/**
 * Output format handler
 *
 * @class Formatter
 */
class Formatter {
  /**
   *Creates an instance of Formatter.
   * @param {String} format Output format
   * @memberof Formatter
   */
  constructor(format) {
    this._formatter = this._getFormatter(format);
  }

  /**
   * Get output from selected formatter
   *
   * @param {Array} issues
   * @returns
   * @memberof Formatter
   */
  getOutput(issues) {
    return this._formatter(issues);
  }

  /**
   * Load formatter
   *
   * @param {String} formatName
   * @returns
   * @memberof Formatter
   */
  _getFormatter(formatName) {
    const formatterPath = `./${formatName}`;

    try {
      return require(formatterPath);
    } catch (ex) {
      throw new Error(`There was a problem loading formatter: ${formatterPath}\nError: ${ex.message}`);
    }
  }
}

module.exports = Formatter;
