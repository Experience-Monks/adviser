# Package JSON Properties

Includes options to restrict and blocklist properties on the package.json

## Syntax

```
  "package-json-properties": [
    "error",
    {
      "required": ["private", "name", "version", "description", "main"],
      "blocklist": ["license"]
    }
  ]
```

The rule `package-json-properties` receives two arguments: `required` and `blocklist`.
At least one argument must be defined

### required

Array of strings - required properties

Possible values: 'private', 'version'

### blocklist

Array of strings - Properties that are not allowed

Possible values: 'license', 'author'
