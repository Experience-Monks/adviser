const async = require('async');
const MinVulnerabilityRule = require('./child');

const RuleMetadata = {
  category: '',
  description: '',
  recommended: false,
  docsUrl: '',
  schema: {}
};

const RuleLifeCycle = {
  Instantiation: 'Instantiation',
  RuleAdded: 'RuleAdded',
  Run: 'Run',
  RuleExecutionKilled: 'RuleExecutionKilled',
  ruleExecutionEnded: 'ruleExecutionEnded'
};

const RuleStatus = {
  Failed: 'Failed',
  Completed: 'Completed',
  Killed: 'Killed'
};

class RuleSandbox {
  constructor(engineReportMethod, ruleContext) {
    this.engineReportMethod = engineReportMethod;
    this.ruleContext = ruleContext;
  }
  report(params) {
    // TODO: Check that is params is an object with the shape of a rule report
    this.engineReportMethod({
      params,
      context: this.ruleContext
    });
  }
}

class RuleContext {
  constructor(ruleName, pluginName, dirname, filename, options, severity) {
    this.ruleName = ruleName;
    this.pluginName = pluginName;
    this.filesystem = {
      dirname,
      filename
    };
    this.options = { ...options };
    this.severity = severity;
  }
}

class RuleFeedback {
  constructor(status, lifeCyclePhase, timing) {
    this.status = status;
    this.lifeCyclePhase = lifeCyclePhase;
    this.timing = timing;
  }
}

class Engine {
  constructor() {
    this.rawRules = [MinVulnerabilityRule, MinVulnerabilityRule, MinVulnerabilityRule, MinVulnerabilityRule];

    MinVulnerabilityRule.meta = { ...RuleMetadata, ...MinVulnerabilityRule.meta };

    console.log(MinVulnerabilityRule.meta);

    let id = 0;

    async.each(this.rawRules, item => {
      this.ruleLifecyclePipeline(item, id);
      id++;
    });
  }

  async ruleLifecyclePipeline(Rule, id) {
    let instanceRule = null;
    let phase = RuleLifeCycle.Instantiation;
    const instanceContext = new RuleContext(
      `min-vulnerability-rule-${id}`,
      'audit-npm',
      '/path/path2',
      'package.json',
      {
        test: 'hola'
      },
      1
    );

    try {
      // 1. Init rules
      instanceRule = new Rule(instanceContext);

      // 2. Add rule to the pipeline
      this.rawRules.push(instanceRule);
      phase = RuleLifeCycle.RuleAdded;
      instanceRule.ruleAdded();

      // 3. Run the rule
      phase = RuleLifeCycle.Run;
      const sandbox = new RuleSandbox(this.report, instanceContext);
      await instanceRule.run(sandbox);
      // TODO: Run this in parallel and assume the rule is async

      // 4. Rule Execution Ended
      phase = RuleLifeCycle.ruleExecutionEnded;
      const feedback = new RuleFeedback(RuleStatus.Completed, phase);
      instanceRule.ruleExecutionEnded(feedback);
    } catch (error) {
      const feedback = new RuleFeedback(RuleStatus.Failed, phase);
      instanceRule.ruleExecutionFailed(feedback, error);
    }
  }

  report(ruleReport) {
    console.log('ruleReport', ruleReport.context.ruleName);
  }
}

const engine = new Engine();
// engine.ruleLifecyclePipeline();
