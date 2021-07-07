/**
 * @fileoverview Rule sandbox.
 *
 */

'use strict';

/**
 * Rule sandbox object for external rules
 *
 * @class RuleSandbox
 */
class RuleSandbox {
  constructor(engineReportMethod, ruleContext) {
    this.engineReportMethod = engineReportMethod;
    this.ruleContext = ruleContext;

    Object.freeze(this);
  }

  /**
   * Report issues back to the Adviser engine
   *
   * @param {Object} params
   * @memberof RuleSandbox
   */
  report(params) {
    if (!params || !params.message || typeof params.message !== 'string') {
      throw new Error(`Invalid message paramater when reporting, it should be a string`);
    }

    if (params.verbose && typeof params.verbose !== 'string') {
      throw new Error(`Invalid verbose paramater when reporting, it should be a string`);
    }

    const reportedMessage = { ...{ message: '' }, ...params };

    this.engineReportMethod({
      params: reportedMessage,
      context: this.ruleContext,
    });
  }
}

module.exports = RuleSandbox;
