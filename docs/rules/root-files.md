# Root Files

Includes options to restrict and blocklist files on the root directory.

## Syntax

```
  "root-files": [
    "error",
    {
      "required": [".editorconfig", ".eslintrc", ".gitignore", "README"],
      "blocklist": ["LICENSE"]
    }
  ]
```

The rule `root-files` receives two arguments: `required` and `blocklist`.
At least one argument must be defined

### required

Array of strings - required files

Possible values: '.editorconfig', '.eslintrc'

### blocklist

Array of strings - Files that are not allowed

Possible values: 'LICENSE'
