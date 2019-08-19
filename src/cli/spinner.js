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
  constructor(enable) {
    this.enable = enable;
    this.spinner = enable ? ora() : null;
  }

  /**
   * Show spinner in the CLI
   *
   * @param {String} stopState Text to show when the spinner stops
   * @param {String} nextState Text to show for the next spinner line
   * @returns
   * @memberof Spinner
   */
  progress(stopState, nextState = stopState) {
    if (!this.enable) return;

    if (stopState) {
      this.spinner.stopAndPersist({
        symbol: logSymbols.success,
        text: stopState
      });
    }

    this.spinner.start(nextState);
  }

  succeed() {
    if (!this.enable) return;

    this.spinner.succeed();
  }
}

module.exports = Spinner;
