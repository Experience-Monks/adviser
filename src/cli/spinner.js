/**
 * @fileoverview CLI Spinner wrapper.
 *
 */

'use strict';

const ora = require('ora');
const logSymbols = require('log-symbols');

/**
 * CLI Spinner
 *
 * @class Spinner
 */
class Spinner {
  /**
   * Creates an instance of Spinner.
   * @param {Boolean} enable
   * @memberof Spinner
   */
  constructor() {
    this.spinner = ora();
  }

  /**
   * Show spinner in the CLI
   *
   * @param {String} stopState Text to show when the spinner stops
   * @param {String} nextState Text to show for the next spinner line
   * @returns {Void}
   * @memberof Spinner
   */
  progress(stopState, nextState = stopState) {
    if (stopState) {
      this.spinner.stopAndPersist({
        symbol: logSymbols.success,
        text: stopState,
      });
    }

    this.spinner.start(nextState);
  }

  /**
   * Stop the spinner
   *
   * @returns {Void}
   * @memberof Spinner
   */
  succeed(stopState) {
    this.spinner.succeed(stopState);
  }
}

module.exports = Spinner;
