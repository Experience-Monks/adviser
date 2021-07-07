# Root Files

Includes options to restrict and blacklist files on the root directory.

## Syntax

```
  "root-files": [
    "error",
    {
      "required": [".editorconfig", ".eslintrc", ".gitignore", "README"],
      "blacklist": ["LICENSE"]
    }
  ]
```

The rule `root-files` receives two arguments: `required` and `blacklist`.
At least one argument must be defined

### required

Array of strings - required files

Possible values: '.editorconfig', '.eslintrc'

### blacklist

Array of strings - Files that are not allowed

Possible values: 'LICENSE'
