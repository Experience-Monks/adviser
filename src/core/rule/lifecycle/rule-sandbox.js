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
    // TODO: Check that params is an object with the shape of a rule report
    this.engineReportMethod({
      params,
      context: this.ruleContext
    });
  }
}

module.exports = RuleSandbox;
