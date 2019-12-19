# Change history for stripes-components

## [5.9.2](https://github.com/folio-org/stripes-components/tree/v5.9.2) (2019-12-19)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.9.1...v5.9.2)

* Export `countries`, `countriesByCode`, `countryCodes`, and localizable country names. Refs UICHKIN-146.

## [5.9.1](https://github.com/folio-org/stripes-components/tree/v5.9.1) (2019-12-09)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.9.0...v5.9.1)

* Support `ref` in Modal via `forwardRef`. Refs ERM-620
* Hotfix for dropdowns: clicks to menu whitespace will not propagate to container.
* include `header` in exceptions for focus-trapping.

## [5.9.0](https://github.com/folio-org/stripes-components/tree/v5.9.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.8.0...v5.9.0)

* Add keyboard navigation to `<Dropdown>`. fixes STCOR-383 and STCOR-382
* Test coverage for `<Dropdown>` at > 80%. STCOM-609
* Convert `<Dropdown>` to use `<Popper>`. STCOM-320.
* Export the `<Popper>` component at top level.
* Added `<MessageBanner>` component (STCOM-592)
* Optionally include translations in `mountWithContext` test helper.
* Support `ref` in `<Tooltip>` via `forwardRef`.
* Validate shape of arguments before accessing them in `<FilterGroups>`. Refs STCOM-623.
* Export the `<Spinner>` component, cribbed from stripes-erm-components, at the top level.
* Export the `<FormattedUTCDate>` component at the top level; provides time-independent formatting for e.g. birthdays.

## [5.8.0](https://github.com/folio-org/stripes-components/tree/v5.8.0) (2019-09-25)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.7.1...v5.8.0)

* Add the `<Tooltip>` component. Refs STCOM-567.
* Multiple `<MultiColumnList>` bug fixes.
* Allow long `<KeyValue>` values to wrap. Refs UIOR-387.

## [5.7.1](https://github.com/folio-org/stripes-components/tree/v5.7.1) (2019-09-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.7.0...v5.7.1)

* Provide more render options within `<PaneFooter>`. Refs STCOM-571.

## [5.7.0](https://github.com/folio-org/stripes-components/tree/v5.7.0) (2019-09-09)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.6.0...v5.7.0)

* Total refactor of rendering of `<MultiColumnList>`. Refs STCOM-363.

## [5.6.0](https://github.com/folio-org/stripes-components/tree/v5.6.0) (2019-08-21)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.5.0...v5.6.0)

* Update font-weights and colors to increase scanability. Refs UX-313, STCOM-563, STCOM-565, STCOM-561.
* Implement fixed-to-bottom `<PaneFooter>` component. Refs STCOM-429.
* Display `<Button>`s as pills (circular/rounded sides). Refs STCOM-564.
* Correctly pass `ref`s to `<MultiSelection>` internal components. Refs STCOM-554.
* Better `<KeyValue>` test infrastructure.
* Update `<PaneFooter>`: consolidate into a single div with adding CSS classes. Refs STCOM-521.

## [5.5.0](https://github.com/folio-org/stripes-components/tree/v5.5.0) (2019-07-22)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.4.2...v5.5.0)

* Allow `<RepeatableField>`'s add and remove buttons to be disabled. Refs UIOR-294.
* Extend `FilterGroups` component to support optional `displayName` prop for the `values` object for the intl purposes. Refs UIU-894.
* Replace Autosizer component with third-party equivalent [react-virtualized-auto-sizer](https://github.com/bvaughn/react-virtualized-auto-sizer). Refs STCOM-543.
* `<ExpandAllButton>` now accepts an optional `id` prop to set on the `<Button>`.
* `<Icon>` may receive custom icons. Refs STCOM-542.
* Correctly set `<Accordion>`'s `id`. Refs STCOM-551.
* `<MetaSection>` elegantly handles missing metadata. Refs STCOM-538.
* `<Datepicker>` cleanup: better i18n, issues with untouched fields.
* Add an optional `footer` prop for `Pane` component for fixed footer feature. Refs STCOM-429.

## [5.4.2](https://github.com/folio-org/stripes-components/tree/v5.4.2) (2019-06-12)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.4.1...v5.4.2)

* Exclude additional currencies. Refs UIU-1076.

## [5.4.1](https://github.com/folio-org/stripes-components/tree/v5.4.1) (2019-06-10)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.4.0...v5.4.1)

* `<AppIcon>` is no longer cropped in the presence of a long title.
* `<Checkbox>` includes prop-type for `innerClass`.

## [5.4.0](https://github.com/folio-org/stripes-components/tree/v5.4.0) (2019-06-07)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.3.0...v5.4.0)

* Use container-width to size panes.
* Be careful when using container-width to size a pane. Refs UIDATIMP-198.
* Avoid scrollbar overlap in accordions. Fixes STCOM-530.
* Filter groups support range queries. Refs UIOR-206.
* Prevent Mac OS from accumulating the scroll value at its margins. UIDATIMP-200.
* Prevent closing of modal when clicking the background. Fixes STCOM-460.
* Implement currency select menu. Refs STSMACOM-205.
* Added `Card` component. STCOM-534

## [5.3.0](https://github.com/folio-org/stripes-components/tree/v5.3.0) (2019-05-10)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.2.0...v5.3.0)

* Create common WYSIWYG editor. STSMACOM-190
* Additional props validation in `<MultiColumnList>`. Fixes STCOM-515.
* Removed gray background color for disabled Buttons with the "dropdownItem"-style. Fixes STCOM-516.
* Panes/Panesets `defaultWidth` supports css-units outside of percent. Fixes STCOM-521.
* `<Paneset>` spreads `data-` attributes to its container, so it no longer needs a wrapper for testing. Fixes STCOM-527, refs UIORG-166.
* Added padding on the scrolling element of the MultiColumnList component to prevent the scrollbar from blocking the content (STCOM-530)
* Fixed "closeOnBackgroundClick" behaviour for `<Modal>` (STCOM-460)

## [5.2.0](https://github.com/folio-org/stripes-components/tree/v5.2.0) (2019-04-25)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.1.0...v5.2.0)

* Fix `<Datepicker>` for non-redux-form usage. Fixes STCOM-493
* Fix issue with `<AutoSuggest>` not using refs correctly. Fixes STCOM-489
* Use minimumRowHeight in `<MultiColumnList>` instead of averageHeight for row rendering/loading. Relates to UIIN-319.
* Added 'iconStyle'-prop for `<Icon>` and added an 'action'-style. STCOM-510.
* Turned off sideEffects to enable tree-shaking for production builds. Refs STRIPES-564 and STRIPES-581.

## [5.1.2](https://github.com/folio-org/stripes-components/tree/v5.1.2) (2019-03-20)
* `<AccordionSet>` considers `closedByDefault` prop when setting up initial state for child accordions. Fixes STCOM-480.

## [5.1.1](https://github.com/folio-org/stripes-components/tree/v5.1.1) (2019-03-14)
* Consider timezone in Datepicker for values containing a time offset. fixes STCOM-484.
* Check for ref existence within MultiSelection before calling `focus()`. fixes STCOM-485.

## [5.1.0](https://github.com/folio-org/stripes-components/tree/v5.1.0) (2019-03-14)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.0.2...v5.1.0)

* Use `moment.tz()` to display the presentedValue in Datepicker, fixes UIREQ-207.
* Update ARIA roles for MCL. STCOM-365
* Add EndOfList component to MCL component. Part of UIDATIMP-105.
* Added asterisk for required form fields. STCOM-46
* Add EndOfList component to MCL component. Part of UIDATIMP-105
* Handle on blur issue for `MultiSelect` when it is part of `redux-form`. See [docs](lib/MultiSelection/readme.md#usage-as-a-part-of-the-field-for-_redux-form_). Part of UIDATIMP-56
* Disable variable fonts. Fixes STCOM-461 and STCOM-434
* In `<MultiColumnList>`, use columns' static keys, not translated aliases, for sorting. Refs STSMACOM-93.
* Fixed autogenerated ID's in withAccordionSet (STCOM-475)
* Add deprecation warning for objects passed to appIcon. Made it possible to pass an `<AppIcon>` instead. (STCOM-473)
* Fixed bug where `<Selection>` wouldn't update the selected item when a new `dataOptions` was passed in.
* Added 1% opaque black for even rows in the MCL (UX-276)
* Updated end of list icon on MCL to use color-text-p2 variable (UXPROD-1570)
* Changed `MetaSection` component's PropTypes for internationalization support (UIDATIMP-156)

## [5.0.2](https://github.com/folio-org/stripes-components/tree/v5.0.2) (2019-01-17)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.0.1...v5.0.2)

* Upgrade `memoize-one`

## [5.0.1](https://github.com/folio-org/stripes-components/tree/v5.0.1) (2019-01-16)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.0.0...v5.0.1)

* Bump `stripes-core` peer dependency

## [5.0.0](https://github.com/folio-org/stripes-components/tree/v5.0.0) (2019-01-15)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.4.0...v5.0.0)

* Add `inputRef` prop to `<TextField>`. Part of STCOM-372.
* Deprecate `getInput()` and `focusInput()` methods of `TextField`. Part of STCOM-372.
* Add [documentation](lib/TextField/Readme.md) for `<TextField>`.
* Add `document` icon
* Replace `<SegmentedControl>` with `<ButtonGroup>`
* Fix broken focus management of `<Selection>` on small screens. Fixes STCOM-433.
* Remove `craftLayerUrl()` util
* Remove deprecated CSS variables
* Remove deprecated `title` props
* Remove deprecated `excludeKeys` prop for `exportCsv`
* Delete `<TabButton>`
* Remove `<IfPermission>` and `<IfInterface>`
* Remove deprecated icon names
* Delete moved `<EntrySelector>`

## [4.5.0](https://github.com/folio-org/stripes-components/tree/v4.5.0) (2018-11-29)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.4.0...v4.5.0)

* Deprecate `<EntrySelector>`
* Introduce `showUserLink` prop on `<MetaSection>`
* Deprecate `<IfInterface>` and `<IfPermission>`, STCOM-357
* Extend InfoPopover with new props (UIDATIMP-5)
* Consistently name icons
* Extend `<InfoPopover>` with `hideOnButtonClick` prop in order to be able to hide it on anchor button click (UIDATIMP-71)

## [4.4.0](https://github.com/folio-org/stripes-components/tree/v4.4.0) (2018-11-19)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.3.1...v4.4.0)

* Remove `injectIntl()` fork
* Simplify `ReduxFormField` usage
* Updated Pane/PaneHeader to accept a `actionMenu`-prop. Added deprecation warning for the `actionMenuItems`-prop (STCOM-388)
* Include `data-total-count` in `<MultiColumnList>'. Available from v4.3.2.
* Don't pass `onSelectItem` to components that don't use it. Fixes STCOR-280. Available from 4.3.2.
* Introduce `tagName` prop on `<Pane>`
* Update `<Modal>` `propTypes`
* Cancel `<Callout>`'s timers on unmount.
* Upgrade dependency on `stripes-react-hotkeys` to version 2.0.0.

## [4.3.1](https://github.com/folio-org/stripes-components/tree/v4.3.1) (2018-11-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.3.0...v4.3.1)

* `color` chokes on rgb/rgba; use hex values instead.
* Validate presence of `props.onClick()` before calling it.
* Allow node prop types for labels and validation messages
* `<AutoSuggest>` updated with custom search and render functionality.

## [4.3.0](https://github.com/folio-org/stripes-components/tree/v4.3.0) (2018-10-31)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.2.0...v4.3.0)

* Make label margins consistent
* Add ability to filter items in EntrySelector. Fixes STCOM-367.
* Resolve issue recursion issue with `trapFocus` with multiple `<Layer>`s. STCOM-366.
* Clear console noise from `<Selection>`/`<SelectList>`. STCOM-369.
* Removed title attribute from AppIcon (STCOR-268) and minor line-height fix
* Fixed `<Layout>`'s `padding-end-gutter` rule.
* Use a CSS class to indicate whether `<EntrySelector>` has any entries. Available from v4.2.2.
* Added more flexbox classes to `<Layout>`. Available from v4.2.4.
* Resize icons
* Export `<NavListItem>`

## [4.2.0](https://github.com/folio-org/stripes-components/tree/v4.2.0) (2018-10-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.1.0...v4.2.0)

* Add clone option to EntrySelector. Fixes STCOM-364.
* Export `<RepeatableField>`
* Shrink `<MetaSection>` font sizes
* Decouple form element styles
* Polish form control sizing

## [4.1.0](https://github.com/folio-org/stripes-components/tree/v4.1.0) (2018-10-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v4.0.0...v4.1.0)
* Add additional top layer exports for `filterState`, `filters2cql`, `onChangeFilter`, and `omitProps`.
* Deprecate craftLayerUrl()
* Create new `<RepeatableField>`
* Fix issue with `<Datepicker>` calendar not applying the chosen value to its `<TextField>`.
* Export `<DefaultAccordionHeader>`

## [4.0.0](https://github.com/folio-org/stripes-components/tree/v4.0.0) (2018-10-02)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v3.3.0...v4.0.0)

* Kebab case all css variables
* Update `<RadioButton>` and `<RadioButtonGroup>` to work independently of Redux Form
* Remove child.type checks
* Remove `<AddressFieldGroup>`;  it's now in `stripes-smart-components`
* Remove `<EditableList>`; it's now in `stripes-smart-components`
* Remove `<Pluggable>`; it's now in `stripes-core`
* Remove `<Settings>`; it's now in `stripes-smart-components`
* Remove deprecated util functions
* Remove old version of `<RepeatableField>`
* Remove deprecated props from `<Datepicker>`

## [3.3.0](https://github.com/folio-org/stripes-components/tree/v3.3.0) (2018-10-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v3.2.0...v3.3.0)

* Use input type="search" for `<SearchField>`
* Create wider type stack
* Add padding to accordion content
* Layer focus management

## [3.2.0](https://github.com/folio-org/stripes-components/tree/v3.2.0) (2018-09-28)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v3.1.0...v3.2.0)

* Update `stripes-form` dependency to v1.0.0
* Fix paneset CSS behavior on narrow screens
* Change global base font size from 14px to 16px
* Expose legend as tag for `<Headline>`
* Adjust headline sizes
* Expose `<Headline>` ref

## [3.1.0](https://github.com/folio-org/stripes-components/tree/v3.1.0) (2018-09-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v3.0.0...v3.1.0)

* Expose `Settings` nav pane width via `navPaneWidth` prop.
* Rename `errorText` and `warningText` props to `error` and `warning` for consistency. Fixes STCOM-314
* Change button relationship margins
* Add min-height to expanded Accordion CSS
* Added "tag"-icon to list of icons
* Adjust `<ModalFooter>` button CSS
* Added example for `<Selection>`
* `makeQueryFunction` once more correctly handles relation modifiers, fixing a regression introduced in commit 1bf498d3. Fixes STCOM-321. Available from v3.0.7.
* Added `<MultiSelection>` component. [STCOM-263](https://issues.folio.org/browse/STCOM-263)
* Deprecate `passThroughValue` prop on `Datepicker` and `Timepicker`
* Update stripes-react-hotkeys dependency to support current versions of React.
* Deprecate `makePathFunction()`, `makeQueryFunction()`, `Pluggable`, `Settings`, `EditableList`, and `AddressFieldGroup`
* Removed text capitalization from MCH column headers so that sentence casing can be controlled elsewhere (STCOM-337)

## [3.0.0](https://github.com/folio-org/stripes-components/tree/v3.0.0) (2018-07-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v2.0.0...v3.0.0)

* In `<Datepicker>`, added a new `ignoreLocalOffset` prop that ignores the tenant timezone and treats the date as UTC to display the date. Fixes UIORG-55
* Adjust address read only view. Fixes STCOM-152.
* `<FilterPaneSearch>` supports `searchableIndexes`, `selectedIndex` and `onChangeIndex` properties. Fixes STCOM-171.
* Functions made by `makeQueryFunction` support the `qindex` parameter, which is interpreted as the name of the _only_ field to search. This allows us to support field-specific searching. Fixes STCOM-172.
* `<Select>` options can be disabled via a 'disabled' property in dataOptions. Fixes STCOM-173.
* `makeQueryFunction` supports relation-modifiers in the `qindex` parameter. Fixes STCOM-174.
* `<FilterGroups>` implements the new `disableNames` property. Fixes STCOM-166.
* `<FilterPaneSearch>` supports specific field selection. Fixes STCOM-177.
* Added `<RepeatableField>` component. Fixes STCOM-143.
* New `failIfNoQuery` argument to `makeQueryFunction`, specifies whether to reject an empty query. Fixes STCOM-181.
* `<MultiColumnList>` accepts a React component as the `isEmptyMessage` property (as well as a string, as before). Fixes STCOM-184.
* In `<FilterGroups>`, the `handleFilterChange` and `handleFilterClear` functions return the modified filter state. Fixes STCOM-188.
* Backwards the function delete-suppression in `<EditableList>` was. Fixes STCOM-189.
* In `<Button>`, omit "hollow" prop from those passed to `<button>`. Fixes STCOM-196.
* Remove the old `<AuthorityList>`, which has been superseded by `<ControlledVocab>` in stripes-smart-components. Completes STSMACOM-6.
* Remove `<MultiColumnList>`'s default click handler - component now checks for a supplied click handler before calling `preventDefault()`. Fixes STCOM-197
* Remove `<MultColumnList>`'s focus-tracking via ref to rowFormatter. Fixes STCOM-202.
* Adjust EditableListForm setup. Fixes STCOM-203.
* Implement `restrictWhenAllSelected` group flag for filter-groups. Fixes STCOM-204. Included in v2.0.1.
* Update `<FilterGroups>` documentation for recent API changes. Fixes STCOM-206.
* `<SearchForm>` does not add a placeholder to the dropdown of indexes if `searchableIndexesPlaceholder` is null. Fixes STCOM-220.
* Generalise `failIfNoQuery` argument to `makeQueryFunction`, now `failOnCondition`. Fixes STCOM-219. Available from v2.0.2.
* Proper documentation for `makeQueryFunction`. Fixes STCOM-221.
* Make `makeQueryFunction` robust to failed substitutions. Fixes STCOM-225. Available from v2.0.3.
* `makeQueryFunction` favours parameter-access via the anointed resource rather than the URL. Fixes STCOM-226. Available from v2.0.4.
* In `<Checkbox>`, nest HTML checkboxes inside labels instead of associating the labels by ID. Fixes STCOM-227. Available from 2.0.5.
* CSS tweak for `<Checkbox>` to bring the UI element back on screen. Refs STCOM-227. Available from 2.0.6.
* In `<EditableList>` (via `<EditableListForm>`), added a new `actionProps` prop to allow for direct prop edits for action buttons.
* Fix multiple addresses displaying side by side. Fixes STCOM-230.
* `<MultiColumnList>` properly fills height when `autosize` prop is used - even on browser resize. Fixes STCOM-29.
* `<Timepicker>` component added. See [docs](lib/Timepicker/readme.md).
* Fixed text overflowing icon in `<Select>`.
* Ignore yarn-error.log file. Refs STRIPES-517.
* `<Selection>` component added. Resolves STCOM-131.
* Custom option formatter added to `<Selection>`. Resolves STCOM-233.
* In queries generated by `makeQueryFunction`, the portion before `sortby` is always parenthesized. Fixes STCOM-240.
* Use country-code to country-name mapping in `<AddressFieldGroup>`. Fixes STCOM-242. Available from v2.0.8.
* MCL should use column-titles, not column keys, for the aria-label field. Fixes STCOM-246. Available from v2.0.9.
* Allow for selecting value programmatically in Selection component. Fixes STCOM-250.
* `<FilterGroups>` support hidden constraints. Refs UIU-400. Available from v2.0.10.
* Don't choke on undefined filters. Fixes UIU-470. Available from v2.0.11.
* Fix `<ConfirmationModal>` scope. Fixes STCOM-255.
* `<EditableList>` now autofocuses the first editable field when mounting an editable row. Fixes STCOM-256.
* Added `<ErrorBoundary>` component to stop render() error propagation.
* Added universal interaction styles to all relevant components.
* Various updates in relation to new universal interaction styles.
* Restore checkbox IDs, which were erroneously removed. Available from v2.0.13.
* Add ability to style cancel button on confirm modal. Part of UIIN-121.
* Settings sections. Refs UIORG-75. Available from v2.0.14.
* Pass parent's resources to EntrySelector. Fixes STCOM-262.
* Updated current CSS variables and added new ones. Replaced in various style sheets
* Updated checked styling of RadioButton and Checkbox. Replaced check icon with SVG in Checkbox.
* `<EditableList>` now uses `itemTemplate` prop to define default field values.
* `<EditableList>` will accept custom edit mode components using the `fieldComponents` prop. Fixes STCOM-272.
* Provide id attribute to accordion expander buttons. Refs STCOM-276. Available from v2.0.17.
* Added `enforceFocus` prop to `<Modal>`.
* Added react-intl decorator to storybook config to prevent certain functions in component context from being undefined
* Added `timezone` prop to `<Timepicker>` for override of context timezone.
* Updated Accordion collapse logic to apply display:none when closed and overflow:visible when open
* Deprecate `structures` directory. [STCOM-277](https://issues.folio.org/browse/STCOM-277)
* `<AccordionSet>` works via context and sets up keyboard navigation for contained `<Accordion>`s. Fixes STCOM-213.
* Add `timezone` prop to `<Datepicker>`.
* Added fix for checkboxes/radiobuttons getting squashed together on small widths. Fixes STCOM-260.
* Added `autocomplete` prop to `<TextField>` that takes HTML5 string values. Fixes STCOM-289.
* camelCase `timeZone` props
* Fix `stripes.context.locale` logic for `<Datepicker>` and `<Timepicker>`
* Added footer-prop to Modal and added a ModalFooter component that can be used as a default modal footer. UIEH-434.
* Fix `activeLink` logic in `<Settings>`: if it's not provided, don't define it. Fixes UIORG-79.
* Use `reduxFormField()` with `<TextField>`. Fixes clear button behavior.
* Fix issue with Selection not rendering as an overlay.
* accessibility updates and tests added to Selection: Single Select.
* add `focusable='false'` attribute to `<Icon>`'s rendered SVG's.
* Modify makeQueryFunction to support param namespacing. Fixes STCOM-300.
* Turn on `pointer-events: auto` for `<Modal>`. Fixes UICHKOUT-437.
* Add link to user record in `<MetaSection>`. Fixes STCOM-305.
* Upgrade to webpack 4. Refs STCOR-175. Available from v2.1.6.
* Correct PropTypes in `<MetaSection>`. Available from v2.1.7.
* expose inner `<Paneset>`'s width as prop on `<EntrySelector>`. Fixes STCOM-309
* Remove `structures` directory. [STCOM-284](https://issues.folio.org/browse/STCOM-284)

## [2.0.0](https://github.com/folio-org/stripes-components/tree/v2.0.0) (2017-12-07)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.9.0...v2.0.0)

* Refactor `<EntrySelector>` to make it more reusable. Fixes STCOM-97.
* Added `<ConfirmationModal>` component to 'structures' folder. Supports STCOM-66. See [docs](lib/ConfirmationModal/readme.md).
* Added `<Callout>` component for supplying feedback to the user with various actions. Supports STCOM-66. See [docs](lib/Callout/readme.md).
* Fix connect in `<Settings>`. Fixes STCOM-99.
* Update `<EntrySelector>`. Fixes STCOM-100.
* Address FieldGroup uses a radio button for setting 'Primary' field. Fixes UIU-260.
* Address FieldGroup's Address Type field will only display options that are previously unused in the address form. Fixes UIU-260.
* Aesthetic updates - Delete button is now a trashcan Icon. Fixes UIU-260.
* Changes in field order- Address Type comes first, Country is last. Fixes UIU-260.
* Add onClick callback to `<EntrySelector>`. Refs UICIRC-20 Scenario 5.
* Fix bug in `<Datepicker>` mis-handling non-US date formats. Fixes STCOM-110, STCOM-114, STCOM-115.
* `transitionToParams` uses `queryString.stringify` instead of by-hand gluing. Fixes STCOM-112
* Fix defaultRoute in `<Settings>` when `pages` is not sorted by `label`. Fixes STCOM-113.
* Add `<LayoutHeader>` and `<LayoutBox>` components for assistance with layout tasks. Covers STCOM-118.
* Fixed bug in `<Paneset>` occurring when multiple Panes are dismissed at once. Fixes STCOM-121, STCOM-117 and STSMACOM-17.
* Include `dataKey` in when connecting `<Settings>` components. Fixes UICIRC-33.
* Adding empty `<Icon icon="profile" />` in support of UIU-283; see STCOM-124.
* Show errors for `<Select>` elements regardless of the presence of a label attribute. Fixes STCOM-126.
* Add `react-tether` to `<Datepicker>`. Fixes STCOM-125.
* Remove `<Accordion>` from `<AddressList`. Fixes STCOM-138.
* Add `interactive` to `<MultiColumnList>` to toggle cursor CSS on non-interactive lists. Fixes STCOM-139.
* Add `handleFilterChange` method for FilterGroups. Works with anointed resource instead of component state. Fixes STCOM-148.
* Add `filterState` method for FilterGroups. Like `initialFilterState` but doesn't need the configuraton object. Fixes STCOM-147.
* Numerous style updates to `<MultiColumnList>`, `<Button>`, `<Checkbox>` and other components.
* Storybook resource added. Run `yarn storybook` to see component demos and documentation.
* Pass a ref through to TextArea for access by a parent. Refs STSMACOM-4.
* Add ability to pass custom filter to `<Selection>` component. Fixes STCOM-251.
* Add ability to colour `<Icon>` using `status` prop.

## [1.9.0](https://github.com/folio-org/stripes-components/tree/v1.9.0) (2017-10-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.8.0...v1.9.0)

* Really restore missing props to generated component in `<TextField>` and `<Button>`. See STCOM-83. Fixes STCOM-84.
* Add Badge component. Fixes STCOM-90.
* Props `noOverflow` and `contentPadding` added to `<Pane>`. See [docs](lib/Pane/readme.md). Fixes STCOM-40.
* `<Dropdown>` supportive classes added to `<Button>`. Fixes STCOM-68.
* Add `<EntrySelector>`, copied from ui-circulation so it can also be used in other modules. Fixes STCOM-92.
* Add 'else' conditional example to documentation for `<IfPermission>`. See [docs](lib/IfPermission/readme.md). Fixes STCOM-93.

## [1.8.0](https://github.com/folio-org/stripes-components/tree/v1.8.0) (2017-09-28)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.7.0...v1.8.0)

* `<Dropdown>` component added. See [docs](lib/Dropdown/readme.md). Part of STCOM-34.
* `react-tether` dependency added for `<Dropdown>`.
* Use metadata, not metaData. See MODNOTES-2.
* Correctly update note's link when selected user changes. Fixes STUTILNOTE-1.
* Explicitly gray out text inputs. Fixes STCOM-9
* Animated Transitions added to `<Accordion>`.
* `<ExpandAllButton>` added to `<Accordion>`. Part of STCOM-71. See [docs](lib/Accordion/readme.md#expand-or-collapse-all)
* Pass native input props into `<RadioButton>`. Fixes STCOM-73
* Add `<SegmentedControl>` component. Resolves STCOM-77. See [docs](lib/SegmentedControl/readme.md).
* DropdownLayout CSS utility classes added to aid in layout of custom Dropdowns.
* `<RadioButtonGroup>` allows non-radio children for varied structure to RadioButton fields. Fixes STCOM-82.
* Refactor out `<Notes>` completely. See STUTILNOTE-2.
* Restore missing props to generated component in `<TextField>`. Fixes STCOM-83.

## [1.7.0](https://github.com/folio-org/stripes-components/tree/v1.7.0) (2017-09-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.6.0...v1.7.0)

* `<Settings>` no longer emits routes for pages which fail the permission check. Fixes STCOM-64.
* Added `separator` prop to `<Accordion>` for adding a border between accordion panes.
* `<FilterGroups>` pass `false` to the separator prop for `<Accordion>`
* Added `displayHeading` prop to `<AddressList>` for optional rendering of the heading and 'Add Address' button.
* Styling adjusted for `<DefaultAccordionHeader>` the background is now transparent for the entire `<Accordion>` header, save for the expand/collapse button.
* Refactor out `<Notes>`'s okapi interaction. See STUTILNOTE-2.

## [1.6.0](https://github.com/folio-org/stripes-components/tree/v1.6.0) (2017-08-31)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.5.0...v1.6.0)

* Add one side radius to `<Button>` styles. Fixes STCOM-57.
* First pass at `<Notes>` CRUD. See LIBAPP-188.
* `<NavListSection>` does not try to render a null child. Fixes STCOM-58.
* *New Component* `<Accordion>` added to fulfill STCOM-20.
* `<Button>` includes prop `buttonRef` for obtaining a ref to its rendered element.
* `down-triangle` and `up-triangle` added to `<Icon>`.

## [1.5.0](https://github.com/folio-org/stripes-components/tree/v1.5.0) (2017-08-25)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.4.0...v1.5.0)

* `<Notes>` component added. Part of STCOM-30.
* `minWidth` prop added to `<DropdownMenu>`.
* 'slim' class added to Button.css.
* New icons added to `<Icon>` ('down-caret', 'up-caret').
* Fix currently selected item in Settings. Fixes STCOM-37.
* Add support for unsaved changes notification to `<AddressEdit>`. Fixes STCOM-35.
* Add boolean prop to control validation rendering for `<TextField>`. Fixes STCOM-39.
* Avoid "Unknown prop `validationEnabled` on `<input>` tag" warning. Fixes STCOM-42.
* MultiColumnList doesn't issue console warnings when displaying React elements. Fixes STCOM-36.
* MultiColumnList will allow overflow to be visible if requested. Fixes UIU-128.
* `<TabButton>` component added. Part of UIU-128.
* Change add button label to 'Add new' for `<EditableList>` and `<AuthorityList>`. Fixes UIU-157.
* Fix selected `<Settings>` pane. Fixes STCOM-50.
* Lint, including updating of the config-airbnb and jsx-a11y libraries. Part of STCOM-21.
* Fix address type validation in `<AddressEdit>`. Fixes STCOM-51.

## [1.4.0](https://github.com/folio-org/stripes-components/tree/v1.4.0) (2017-08-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.3.0...v1.4.0)

* Added dependency to `stripes-react-hotkeys` - broke HotKeys code out to its own npm repo. (@folio/stripes-react-hotkeys.)
* `<Button>` will render anchor if passed an href attribute. Completes STCOM-24
* PaneMenu buttons take up height of Pane Header.
* `<MultiColumnList>` focus of row follows row selection via bound keyboard navigation. Fixes STCOM-25 and 27.
* Change address button label. Fixes UIU-138
* Remove hardwired keyMap from `<MultiColumnList>`: use the one inherited from stripes-core. Part of STRIPES-359.
* Lint: clean up whitespace complaints. Part of STCOM-21.
* Lint: clean up semicolon complaints. Part of STCOM-21.
* Lint: clean up comma complaints. Part of STCOM-21.
* Lint: clean up import complaints. Part of STCOM-21.
* Lint: clean up arrow function complaints. Part of STCOM-21.
* Import `PropTypes` from `prop-types` instead of `React`. Part of STRIPES-427.
* Use configurable key-mappings to navigate search results. Fixes STCOM-28.
* `<FilterPaneSearch>` accepts optional new `placeholder` prop to specify placeholder text. Fixes STCOM-32.
* Add support for unsaved changes to `<EditableList>`. Fixes STCOM-26.

## [1.3.0](https://github.com/folio-org/stripes-components/tree/v1.3.0) (2017-07-06)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.2.0...v1.3.0)

* `<MultiColumnList>` supports block anchors in custom rowFormatter.
* `react-overlays` dependency version updated to 0.7.0.
* Add "height" prop and a max-height property(CSS) to `<Pane>`. Fixes STRPCOMP-16.
* Remove alert from `<FocusLink>`.
* Removed 'Example' directory.
* Keep `primaryAddress` field name consistent across `<AddressFieldGroup>` components.
* `<Pluggable>` recognises the special value `@@` for "no plugin". Fixes STRPCOMP-15.
* In `<AuthorityList>`, use `label` as pane-title, not `<h3>`. Part of STRPCOMP-1.

## [1.2.0](https://github.com/folio-org/stripes-components/tree/v1.2.0) (2017-06-30)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.1.0...v1.2.0)

* Bold chevron icons added to `<Icon>` component.
* Integrate `<FocusLink>` into `<FilterPaneSearch>` component. Part of STRPCOMP-7.
* Add `<FocusLink>` component. Part of STRPCOMP-7. [docs](lib/FocusLink/readme.md)
* `<MultiColumnList>` now passes columns, columnWidths, and cell aria-labels to rowFormatter so that they can be used in custom row templates. Fixes STRPCOMP-11
* `<MultiColumnList>` `columnWidths` prop is now functional. Fixes STRPCOMP-12. [docs](lib/MultiColumnList/readme.md)
* Added documentation for [handling CSS](docs/CSSinStripes.md) and [module layout components](docs/UIModuleLayout.md). Fixes STRPCOMP-10.
* Cured shifting of field buttons on form field validation.
* Keep primary address field name consistent. STRPCOMP-4.
* `<EditableList>` accepts optional `nameKey` argument. Needed for STRPCOMP-8.
* New component, `<AuthorityList>`, provides the underlying functionality for authority-list settings pages. Fixes STRPCOMP-8.

## [1.1.0](https://github.com/folio-org/stripes-components/tree/v1.1.0) (2017-06-26)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v1.0.0...v1.1.0)

* `<Icon>` [documentation](lib/Icon/readme.md)
* `<Icon>` can be centered using the `center` prop.
* `<Icon>` includes a trashbin icon.
* `<Icon>` updated to use `classnames` library.
* Style initialization of `<Pane>` moved to the constructor. (STRPCOMP-2)
* `<Datepicker>` uses momentjs strict mode to avoid deprecation warnings.
* `labelStyle` option `formLabel` added to `<Checkbox>`
* Styling prop `marginBottom0` supported on `<Select>`
* Remove focus border outline from `<MultiColumnList>`
* Fix issue with `<Datepicker>` not rendering updated date values. (STRPCOMP-6)
* Added timestamp to the state of `HotKeys` so that it will refresh its broadcasted context.
* Fixed couple minor issues in `<AddressFieldGroup>`. (STRPCOMP-4)
* react-hotkeys fix: when hot-key bindings are modified the new bindings take effect immediately. Fixes STRPCOMP-5.

## [1.0.0](https://github.com/folio-org/stripes-components/tree/v1.0.0) (2017-06-22)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.16.0...v1.0.0)

* Added `<EmbeddedAddressForm>` and `<AddressEditList>` component to `<AddressFieldGroup>` to support nesting within forms.

## [0.16.0](https://github.com/folio-org/stripes-components/tree/v0.16.0) (2017-06-21)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.15.0...v0.16.0)

* `<SRStatus>` component added for accessibility support. [docs](lib/SRStatus/readme.md)
* `<Datepicker>` bugfix for manually entering date. (LIBAPP-219)
* `<Select>` uses `classnames` library to apply its styling.
* Remove 'selected' attribute from `<Select>`'s placeholder option. (STRIPES-422)
* `<Settings>` pulls `paneTitle` from `props` instead of hard-coding it.

## [0.15.0](https://github.com/folio-org/stripes-components/tree/v0.15.0) (2017-06-14)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.14.0...v0.15.0)

* In `makeQueryFunction`, the `sort` parameter is now a comma-separated list of criteria. Towards UIU-83.
* `<Datepicker>` pulls locale from stripes object.

## [0.14.0](https://github.com/folio-org/stripes-components/tree/v0.14.0) (2017-06-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.13.0...v0.14.0)

* `<Datepicker>` uses `locale` prop to set default presentational date format.
* `<MultiColumnList>` index of rows exposed to `formatter` functions.
* `<MultiColumnList>` bug fix for component not updating when supplied new value for `visibleColumns` prop.
* Support for reverse sorting, UIU-81:
  * makeQueryFunction supports reverse sorting ('`-`' prefixing sort-field).
  * In `<MultiColumnList>`, getHeaderClassName uses the ascending/descending styles only on the current sorting header.
  * In `<MultiColumnList>`, add CSS pseudoclasses for `.ascending::after` and `.descending::after`.

## [0.13.0](https://github.com/folio-org/stripes-components/tree/v0.13.0) (2017-06-09)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.12.0...v0.13.0)

* Top `<Settings>` link is highlighted by default. Fixes the last part of STRIPES-357.
* Add the `<IfInterface>` component, which renders its children only if the specified server-side interface is available at a compatible version.

## [0.12.0](https://github.com/folio-org/stripes-components/tree/v0.12.0) (2017-06-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.11.2...v0.12.0)

* `<MultiColumnList>` supports infinite-scroll functionality via the `virtualize` prop. This comes with a few other updates to the API such as the `autosize` prop and `onNeedMoreData`. See [docs](lib/MultiColumnList/readme.md)
* `<MultiColumnList>` has 'fixed' column headers that will remain visible when the body of the list is scrolled.
* `<Pane>` will not automatically set a minimum width to its content's wrapping div, opting for fluid width as a default.

## [0.11.2](https://github.com/folio-org/stripes-components/tree/v0.11.2) (2017-06-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.11.1...v0.11.2)

* Add `create-react-class` to dependencies, since this is needed by the modified version of react-hotkeys that was provided in v0.11.0.

## [0.11.1](https://github.com/folio-org/stripes-components/tree/0.11.1) (2017-06-07)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.11.0...v0.11.1)

* Add `mousetrap` to dependencies, since this is needed by the modified version of react-hotkeys that was provided in v0.11.0.

## [0.11.0](https://github.com/folio-org/stripes-components/tree/v0.11.0) (2017-06-07)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.10.1...v0.11.0)

* `<HotKeys>` component allow for applying shortcut key combinations to modules or sub-sections of modules.
*  Layout Grid - using [react-flexbox-grid](https://roylee0704.github.io/react-flexbox-grid/) to replace the float-based grid from react-bootstrap. [docs](lib/LayoutGrid/readme.md)
* `<Select`> component will now correctly display a placeholder value if there is one.

## [0.10.1](https://github.com/folio-org/stripes-components/tree/v0.10.1) (2017-06-05)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.10.0...v0.10.1)

* `<Datepicker>` - fix multiple issues with date navigation and focus management. (STRIPES-398)

## [0.10.0](https://github.com/folio-org/stripes-components/tree/v0.10.0) (2017-06-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.9.0...v0.10.0)

* `<Settings>` component now sorts settings pages by label. Implements STRIPES-358.
* `<TextField>` hides clear "&#10005;" when `readOnly` prop is true.
* `<Datepicker>` changed 'format' prop to 'DateFormat' for better cooperation with redux-form `<Field>` component.
* `<Datepicker>` hides clear and calendar controls, disables functionality when `readOnly` prop is true.
* Update stripes-core dependency to 1.7.0, so we get the Stripes object on the context.
* `<IfPermission>`, `<Pluggable>` and `<Settings>` now all take the Stripes object from the React context rather than expecting it to be passed in as a prop. Fixes STRIPES-395.

## [0.9.0](https://github.com/folio-org/stripes-components/tree/v0.9.0) (2017-05-22)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.8.0...v0.9.0)

* `<Pluggable>` component now honours the plugin preferences provided in the Stripes object. These are available from stripes-core v1.6.0, and the peer-dependency is updated accordingly.
* `<Settings>` component now passes the `label` part of the settings object down into the component.

## [0.8.0](https://github.com/folio-org/stripes-components/tree/v0.8.0) (2017-05-17)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.7.0...v0.8.0)

* Add the `<Pluggable>` component. Implements Stripes plugins (STRIPES-379).
* Fix a couple of minor JS-console warnings.

## [0.7.0](https://github.com/folio-org/stripes-components/tree/v0.7.0) (2017-05-03)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.6.1...v0.7.0)

* Add `makeQueryFunction` util to replace `makePathFunction` which will be removed in a subsequent release.
* Add `<Settings>` component to render top-level settings pages for Stripes modules.

## [0.6.1](https://github.com/folio-org/stripes-components/tree/v0.6.1) (2017-04-14)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.6.0...v0.6.1)

* Added `fluidContentWidth` prop to `<Pane>` component. This suppresses `<Pane>` wrapping its content in a div with static minimum width.
* Added `defaultWidth` prop to `<Paneset>` in case paneset needs a specified width. Defaults to `'fill'`

## [0.6.0](https://github.com/folio-org/stripes-components/tree/v0.6.0) (2017-04-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.5.0...v0.6.0)

* Added `<Modal>` component. [docs](lib/Modal/readme.md)
* Added `dismissible` and `onClose` props to `<Pane>`. `dismissible` can be used to render a dismiss '&times;' button, with a corresponding handler supplied in `onClose` that will be triggered when the pane is dismissed. The module should use this handler to clean up any state or logic that triggered the pane's rendering. [docs](lib/Pane/readme.md)
* `<Layer>` renders its contents to the root of the containing `<Paneset>`. [docs](lib/Layer/readme.md)
* Prop `isRoot` added to `<Paneset>` - this should be used for full-width panesets added in new `<Layer>` components to ensure that the descendent `<Panes>` are tracked and sized appropriately. [docs](lib/Paneset/readme.md)
* Use `requestAnimationFrame` to improve rendering performance of `<Textfield>`
* Added 'browser' and 'node' environments to eslint configuration so that it will accept calls to browser functions such as `requestAnimationFrame`.

## [0.5.0](https://github.com/folio-org/stripes-components/tree/v0.5.0) (2017-03-28)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.4.0...v0.5.0)

* Add `<EditableList>` component.
* Add clear-field button to the `<TextField>` component.
* Add `columnMapping` prop to `<MultiColumnList>`
* `<MultiColumnList>` `onHeaderClick` callback is passed "name" and "alias" for the column in case `columnMapping` prop is supplied.

## [0.4.0](https://github.com/folio-org/stripes-components/tree/v0.4.0) (2017-03-22)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.3.0...v0.4.0)

* The `<IfPermission>` component now uses the stripes-core v0.4.0 API for permission-checking, and the stripes-core peer-dependency has been made explicit.

## [0.3.0](https://github.com/folio-org/stripes-components/tree/v0.3.0) (2017-03-17)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.2.0...v0.3.0)

* `transitionToParams` now uses the new release of [React Router](https://reacttraining.com/react-router/). This significantly changes the API for URL-derived props and for changing the URL.

## [0.2.0](https://github.com/folio-org/stripes-components/tree/v0.2.0) (2017-03-16)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.1.0...v0.2.0)

* Add the `<IfPermission>` component, which renders its children only if the specified permission is present.
* Change substitution syntax in the `queryTemplate` parameter of the `makePathFunction` utility function from `${query}` to `$QUERY`. The former misleading resembled ES6 string-template notations, but that's not really what was happening here.

## [0.1.0](https://github.com/folio-org/stripes-components/tree/v0.1.0) (2017-03-16)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.0.4...v0.1.0)

* Add the utility function `makePathFunction` and [its documentation](util/README.md).

## [0.0.4](https://github.com/folio-org/stripes-components/tree/v0.0.4) (2017-03-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.0.3...v0.0.4)

* Added Datepicker Component.
* Updated TextField Component to make use of validation styles/icons
* Updated Icon component to include validation icons for success, error, and a spinner for asynchronous validation in progress.
* Updated Dependencies in package.json to include moment.js, classnames, and react-overlays libraries.

## [0.0.3](https://github.com/folio-org/stripes-components/tree/v0.0.3) (2017-03-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v0.0.2...v0.0.3)

* Add new area, [`util`](util), for utility functions. This contrasts with `lib`, which contains utility components.
* Add new utility function `transitionToParams` -- see the Users UI module for an example of how to use it. Fixes STRIPES-216.
* Add [documentation](util/README.md) for `transitionToParams`.
* `<List>` warns if passed a falsy value for items.

## [0.0.2](https://github.com/folio-org/stripes-components/tree/v0.0.2) (2017-02-25)

* First version to have a documented change-log. Each subsequent version will
  describe its salient differences from the previous one.
* Includes the FilterGroups library.
