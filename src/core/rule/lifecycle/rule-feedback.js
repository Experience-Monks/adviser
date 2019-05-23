/**
 * @fileoverview Rule feedback.
 *
 */

'use strict';

/**
 * Rule feedback object for external rules
 *
 * @class RuleFeedback
 */
class RuleFeedback {
  constructor(status, lifeCyclePhase, timing) {
    this.status = status;
    this.lifeCyclePhase = lifeCyclePhase;
    this.timing = timing;
  }
}

module.exports = RuleFeedback;
