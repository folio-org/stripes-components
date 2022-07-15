# Contribution guidelines

Guidelines for Contributing Code:
[dev.folio.org/guidelines/contributing](https://dev.folio.org/guidelines/contributing)

## Additionally

Before adding a new component, be sure that your use-case isn't already covered by an existing component. Filing a JIRA in the STCOM project to open the door for discussion and raise awareness of the issue/gap in functionality is a very important initial step.

Please limit PR's in scope. A PR with a high number of changed files can be quite difficult to effectively review. The last thing that we want is to merge in the fix to a single problem while introducing 4 or 5 new ones at the same time.

## Testing
Component tests are automated browser tests powered by karma and written using mocha syntax. See [Testing in Stripes Components](guides/Testing.stories.mdx) for more information.
