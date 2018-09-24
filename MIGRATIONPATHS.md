# Stripes-Components Migration Paths
## 3.x to 4.x
Upcoming release.
[Some Components and utilities have moved](#some-components-and-utilities-have-moved)
### Some Components and utilities have moved
We've provided console warnings for these items. If you've used these in your module with a `stripes-components` path, you'll simply have to update your import path:

Component/Util | New path
-- | --
`<AddressList>` | `@folio/stripes-smart-components/lib/AddressFieldGroup/AddressList`
`<AddressEditList>` | `@folio/stripes-smart-components/lib/AddressFieldGroup/AddressEdit/AddressEditList` 
`<EmbeddedAddressForm>` | `@folio/stripes-smart-components/lib/AddressFieldGroup/AddressEdit/EmbeddedAddressForm`
`<EditableList>` | `@folio/stripes-smart-components/lib/EditableList`
`<Settings>` | `@folio/stripes-smart-components/lib/Settings`
`<Pluggable>`  | `@folio/stripes-core/lib/Pluggable`
`makeQueryFunction()` | `@folio/stripes-smart-components/lib/SearchAndSort/makeQueryFunction`



