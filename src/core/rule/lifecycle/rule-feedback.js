/**
 * @fileoverview Rule feedback.
 *
 */

'use strict';

class RuleFeedback {
  constructor(status, lifeCyclePhase, timing) {
    this.status = status;
    this.lifeCyclePhase = lifeCyclePhase;
    this.timing = timing;
  }
}

module.exports = RuleFeedback;
