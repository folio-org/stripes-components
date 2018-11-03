# Breaking Changes and Deprecations
Change happens. We learn more, we find better ways to do things. We clean house and beautify API's, improve user experience, accessibility, and developer experience.
Through the Request for comment (RFC) process, modifications to the component library are proposed and agreed upon by the community of FOLIO developers. The outcome of this process is an iterative plan to accomplish the proposed goal. The changes are weighed against non-functional requirements's (NFR's) - not limited to maintainability, platform stability, testability, extent of migration effort - with breaking change as final resort.
## Break as softly as possible.
Through adequate release planning and up-front migration development, we aim to facilitate platform stability and reduce development stress, providing adequate timelines for migration to new code.
## Semver
We use the Semver versioning system where changes to the Major number (the first one) represent a present backwards incompatibility.
Some examples of how we determine version number changes:
* **Patch Version -** fully compatible bug fixes, minor improvements. ex: `3.0.9` to `3.0.10`.
* **Minor Version -** new props, components, capabilities. ex: `3.0.10` to `3.1.0`.
* **Major Version -** an incompatible change is present in the system. Removal of a component or component props with no co-existing replacement. ex: `3.1.0` to `4.0.0`.
## Console Warnings
Whenever possible, the release of breaking changes is preceded by console warnings. These may appear months prior to the actual breaking change, depending on the extent of migration effort.
## Available migration
The new ways of doing things should be available for developers at their announcement. These may exist as parallel release, or in updated branches.
### Parallel release
When possible, new solutions will exist together within a platform. With both solutions present, UI module developers may switch over to the new API/component/utility and release their updates to a point release of their module.
### Updated Branches
If they cannot be released in parallel, new changes may live in a separate branch of the `stripes-components` repo, so necessary migration work may be achieved even before the breaking changes are released. Multiple upcoming breaking changes may be pooled within a dedicated branch for the next version of the library, so a developer may clone the branch and possibly `yarn-link` it into their local workspace.

## Example scenario
### Moving Components
We may see fit to move components from one core repo to another so to adequately support that component's dependencies. Say, for example, we're at version 3.0.10 and It's decided that we will move `<XExampleComponent>` (`<XREC>`) component to another core repo.

**Step 1:** We copy the component to its new home and merge those changes to the master of that repo. Changes are logged at the new repo.

**Step 2:** We place a console warning (as mentioned above) that the path to `<XREC>` should be updated. Migration is additionally documented in our [Migration document](MIGRATION.md) and the change is logged as a deprecation warning in our [change log](CHANGELOG.md). We bump our Minor version for this release. We're `v3.1.0` now.

**Step 3:** The changes are released and exist in parallel for a release cycle, giving ample time for developers to perform updates.

**Step 4:** Developers make the necessary changes and the console warnings no longer appear when importing `<XREC>` from its new path...

**Step 5:** `<XREC>` is removed from `stripes-components` in a new major version.  `4.0.0`
