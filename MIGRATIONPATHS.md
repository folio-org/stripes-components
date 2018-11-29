# Stripes-Components Migration Paths
## 3.x to 4.x
Upcoming release.

### Some Components and utilities have moved
We've provided console warnings for these items. If you've used these in your module with a `stripes-components` path, you'll simply have to update your import path:

Component/Util | New path
-- | --
`<AddressList>`, `<AddressEditList>`, `<EditableList>`, `<Settings>`  | `import { ... } from '@folio/stripes/smart-components'`
`<Pluggable>`  | `@folio/stripes/core`
`makeQueryFunction()` | `import { makeQueryFunction } from '@folio/stripes/smart-components'`
