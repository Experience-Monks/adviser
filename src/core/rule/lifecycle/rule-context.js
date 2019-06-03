/**
 * @fileoverview Rule context.
 *
 */

'use strict';

/**
 * Rule context object for external rules
 *
 * @class RuleContext
 */
class RuleContext {
  constructor(ruleName, pluginName, dirname, filename, options, severity, verboseMode) {
    this.ruleName = ruleName;
    this.pluginName = pluginName;
    this.filesystem = {
      dirname,
      filename
    };
    this.options = { ...options };
    this.severity = severity;
    this.verboseMode = verboseMode;
  }
}

module.exports = RuleContext;
