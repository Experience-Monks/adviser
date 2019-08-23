# Package JSON Properties

Includes options to restrict and blacklist properties on the package.json

## Syntax

```
  "package-json-properties": [
    "error",
    {
      "required": ["private", "name", "version", "description", "main"],
      "blacklist": ["license"]
    }
  ]
```

The rule `package-json-properties` receives two arguments: `required` and `blacklist`.
At least one argument must be defined

### required

Array of strings - required properties

Possible values: 'private', 'version'

### blacklist

Array of strings - Properties that are not allowed

Possible values: 'license', 'author'
