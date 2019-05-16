# sentinal-plugin-audit-npm

Run npm audit on the package.json

## Installation

You'll first need to install [Sentinal](http://sentinal.org):

```
$ npm i sentinal --save-dev
```

Next, install `sentinal-plugin-audit-npm`:

```
$ npm install sentinal-plugin-audit-npm --save-dev
```

**Note:** If you installed Sentinal globally (using the `-g` flag) then you must also install `sentinal-plugin-audit-npm` globally.

## Usage

Add `audit-npm` to the plugins section of your `.sentinalrc` configuration file. You can omit the `sentinal-plugin-` prefix:

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
