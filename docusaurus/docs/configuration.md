---
id: configuration
title: Configuration file
sidebar_label: Configuration
---

Adviser requires to have a configuration file to run (we are thinking about removing this requirement). You can create this file manually or use `$ adviser --init`.

## Minimal configuration file

Adviser comes with built-in rules, therefore the only required files in the configuration file are rules.

An example of a minimal configuration file is:

```
{
  "rules": {
    "package-json-properties": [
      "error",
      {
        "required": ["private", "name", "version", "description", "main"],
        "blacklist": ["engines"]
      }
    ],
    "root-files": [
      "error",
      {
        "required": [".commitlintrc.yml", ".editorconfig", ".eslintrc", ".gitignore", ".prettierrc", "README"],
        "blacklist": [".ds_store"]
      }
    ]
  }
}
```

[Check out here the built-in rules](/built-in-rules.html)

## Adding a plugin

Adviser is modular, therefore you can use the published plugins in npm. To check out a brief list of plugins visit our [plugins page](/plugins.html).

To add a plugin, use the property `plugins` and add our plugin's name inside an array. The plugin's name must be published to npm following the prefix `adviser-plugin`, but to use it you remove that prefix. Every rule inside the plugin must be prefixed with the plugin's name.

In the below case, we are using the plugin `adviser-plugin-dependencies` and we are running the rule `package-size`. The rule `package-size` has a threshold option that is being used and will return a warning message in case the criteria fails.

```
{
  "plugins": ["dependencies"],
  "rules": {
    "dependencies/package-size": ["warn", { "threshold": 25 }]
  }
}
```

## Using settings for plugins

There are some plugins that may need general settings that will affect all the rules, for those cases you can pass options to plugins using the property `settings`.

To pass options to the plugin `adviser-plugin-dependencies` for example, you can use:

```
{
  "plugins": ["dependencies"],
  "rules": {
    "dependencies/package-size": ["warn", { "threshold": 25 }]
  },
  "settings": {
    "dependencies": {
      "option1": "option1",
      "option2": "option2"
    }
  }
}
```

Checkout the plugin's documentation for available options
