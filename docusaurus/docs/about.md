---
id: about
title: About Adviser
sidebar_label: About Adviser
---

## Why was born

Many of the projects at Jam3 have strong quality requirements that need to be checked manually along the project lifecycle and the vast majority of these requirements are not covered by linters. We thought will be cool to have a tool with a similar structure than a linter to avoid any learning curve, but with a wider scope of testing.

## What is adviser

In really simple words, it's the result of merging a task runner with a linter. It runs rules located inside plugins, those rules must follow some structure conventions. Adviser handles internally a lifecycle flow for those rules and plugins, and allow having options for the rules, and options across all the rules of that plugin. Also includes hooks for plugins to help developing tasks that must run only in specific moments of the full cycle.

## Future

We use adviser in our projects, and we are excited about the potential it has. Our main focus is make it even faster because some rules may take a while to run. On the other hand we don't want to limit rules therefore we will continue developing challenging rules that will save time in projects and will help to maintain a good quality standard.
