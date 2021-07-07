---
id: create-plugins
title: Create plugins
sidebar_label: Create plugins
---

## Basic plugin

The simplest version of a plugin is a collection of rules, let's say an object with the following structure:

```
module.exports = {
  rules: {
    rule-name: Object
  }
}
```

## Advanced plugin

Adviser provides an API in case you would like to use hooks or receive options from the configuration file. To use the Adviser's API you should have Adviser installed among your project dependencies and extend from Adviser.Plugin.

An example of plugin will be:

```
const path = require('path');
const requireIndex = require('requireindex');

const Adviser = require('adviser');

class Example extends Adviser.Plugin {
  constructor(settings) {
    super(settings);

    this.rules = requireIndex(path.join(__dirname, '/rules'));
  }

  preRun(context) {}

  postRun(summary) {}
}

module.exports = Example;
```

### Settings

Adviser sends the the settings defined in the configuration in the contructor of the class.

### Pre run hook

If you need to run code before running any rule, the pre-run hook is the ideal place. Adviser won't run any rule until the pre-run hook finishes. In case you need to do asynchronous work you can return a Promise.

It receives a context argument with:

- plugin name
- rules id
- rules severity
- rules options

### Post run hook

Similar to the pre-run hook, the post-run hook will be executed only after all the rules were exectured. In case you need to do asynchronous work you can return a Promise.

It receives a summary argument with:

- plugin name
- rules id
- rules severity
- rules execution status
- rules execution duration

## Metadata

Plugins can use metadata, to add metadata to the plugin add the property `meta` to the plugin Object or Class.

```
const path = require('path');
const requireIndex = require('requireindex');

const Adviser = require('adviser');

class Example extends Adviser.Plugin {
  constructor(settings) {
    super(settings);

    this.rules = requireIndex(path.join(__dirname, '/rules'));
  }
}

Example.meta = {
  description: 'Security example rules',
  recommended: true
};

module.exports = Example;
```
