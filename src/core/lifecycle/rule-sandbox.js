/**
 * @fileoverview Rule sandbox.
 *
 */

'use strict';

class RuleSandbox {
  constructor(engineReportMethod, ruleContext) {
    this.engineReportMethod = engineReportMethod;
    this.ruleContext = ruleContext;
  }
  report(params) {
    // TODO: Check that params is an object with the shape of a rule report
    this.engineReportMethod({
      params,
      context: this.ruleContext
    });
  }
}

module.exports = RuleSandbox;
