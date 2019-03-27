# intern-sentinal

Jam3 quality advisor

Steps:
[Done] Run CLI
[Done] Load config files (find config file recursively) or base on a path
[Done] Validate file - general schema (Using AJV)
[In Progress] Create sample plugin and load it
Run plugin

Load plugins (validate plugins are installed)
Load Rules
Validate Rules (global format, call plugin for custom validation)
Get list of files where to run (package.json, \*.js)
Execute rules/plugins
Get output from plugins
Output

Things I may need:
Event Emitter

Things to add:
Tests
Tracks performance of individual rules
Add cache
Find all package.json inside a directory and run sentinal there.
Run the CLI with more parameters like plugins, rules, etc (so it doesn't need to use a file)
