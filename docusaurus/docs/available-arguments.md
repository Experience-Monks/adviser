---
id: available-arguments
title: Arguments
sidebar_label: Arguments
---

## Arguments

Full list of arguments:

- `--init` Run config initialization wizard
- `--config` Specify config file path
- `--tags` Run rules that match with the tags
- `--verbose` Display extra information
- `--debug` Output debugging information
- `--help` Show help
- `--version` Output the version number

### Create a basic configuration file

```
$ adviser --init
```

It creates a config file called `.adviserrc` with the following structure

```json
{
  "plugins": [],
  "rules": {}
}
```

[Paste here gif]

### Load configuration file

By default Adviser tries to find automatically the configuration file in the current directory and search up the directory tree for the following:

- a package.json property called `adviser`
- `.adviserrc`
- `.adviserrc.json`
- `.adviserrc.js`
- `.adviserrc.yml`
- `.adviserrc.yaml`
- `.adviser.config.js`

If you want to specify an internal folder or a custom name use the command:

```
$ adviser --config custom.adviser.json
```

[Paste here gif]

### Tags

Rules can be tagged in two ways, in the metadata and in the adviser configuration file.

Tags in the rule's metadata will look like:

```
class RootFiles extends Rule {}

RootFiles.meta = {
  tags: ['quick', 'fs']
};
```

Tags in the adviser configuration file will look like:

```
{
  "rules": {
    "package-json-properties": [
      "error",
      {
        "required": ["private"],
        "blacklist": ["license"]
      }
    ]
  },
  "settings": {
    "tags": {
      "dependencies-change": ["package-json-properties"],
      "fs": ["rule1", "rule2"]
    }
  }
}

```

Note: tags in the configuration file will override the tags defined in the rule's metatag

To run the rules with tags `dependencies-change` and `fs` you will run: `adviser --tags dependencies-change,fs`

### Verbose

Let's just be more verbose. There are rules that have more information to provide but the summary terminal box is kind of small, in that case the rules can send extra information that will be shown only in verbose mode. Also you will see a summary of the rules that were executed at the bottom with the running status (failed, completed, skipped).

To use the debug mode use the command:

```
$ adviser --verbose
```

[Paste here gif]

### Debugging

To know more about what Adviser is doing, use the debug mode. It will show you a trail of every module that the engine is using and detailed error messages.

To use the debug mode use the command:

```
$ adviser --debug
```

[Paste here gif]
