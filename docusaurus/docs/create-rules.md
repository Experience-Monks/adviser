---
id: create-rules
title: Create rules
sidebar_label: Create rules
---

To create rules Adviser provides an API that help the engine with the rule's lifecycle.

## Create your first rule

To use the Adviser's API you should have Adviser installed among your project dependencies and extend from Adviser.Rule.

An example of rule will be:

```
const Adviser = require('adviser');

class ExampleRule extends Adviser.Rule {
  constructor(context) {
    super(context);
  }

  run(sandbox) {}
  ruleExecutionFailed(feedback, error) {}
  ruleExecutionEnded(feedback) {}
}

module.exports = ExampleRule;
```

### Rule's context

Adviser sends the rule's context in the constructor, the context includes:

- dirname
- filename
- options defined in the configuration file
- ruleId
- severity

### Run method

### Execution Failed Hook

### Execution Ended Hook
