# adviser-plugin-audit-npm

Run npm audit on the package.json

## Installation

You'll first need to install [Adviser](http://adviser.org):

```
$ npm i adviser --save-dev
```

Next, install `adviser-plugin-audit-npm`:

```
$ npm install adviser-plugin-audit-npm --save-dev
```

**Note:** If you installed Adviser globally (using the `-g` flag) then you must also install `adviser-plugin-audit-npm` globally.

## Usage

Add `audit-npm` to the plugins section of your `.adviserrc` configuration file. You can omit the `adviser-plugin-` prefix:

```json
{
  "plugins": ["audit-npm"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "audit-npm/min-vulnerabilities-allowed": 2
  }
}
```

## Supported Rules

- Fill in provided rules here
