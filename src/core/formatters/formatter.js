/**
 * @fileoverview Formatter factory
 *
 */

'use strict';

class Formatter {
  constructor(format) {
    this._formatter = this._getFormatter(format);
  }

  getOutput(issues) {
    return this._formatter(issues);
  }

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
