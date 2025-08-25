# Change history for stripes-components

## [13.0.7](https://github.com/folio-org/stripes-components/tree/v13.0.7) (2025-08-25)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.6...v13.0.7)

* Correctly handle empty language-codes in `formattedLanguageName()`. Refs STCOM-1451.

## [13.0.6](https://github.com/folio-org/stripes-components/tree/v13.0.6) (2025-05-06)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.5...v13.0.6)

* Bugfix - clicking the trigger on an open `<Popover>` now closes the `<Popover>` instead of closing/reopening. Refs STCOM-1429.

## [13.0.5](https://github.com/folio-org/stripes-components/tree/v13.0.5) (2025-04-10)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.4...v13.0.5)

* `AuditLog` - add `showSharedLabel` property to display "Shared" instead of "Original version" in the original card. Refs STCOM-1430.

## [13.0.4](https://github.com/folio-org/stripes-components/tree/v13.0.4) (2025-04-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.3...v13.0.4)

* Display `Changed from - "true/false"` and `Changed to - "true/false"` values for boolean fields in AuditLogModal. Fixes STCOM-1427.

## [13.0.3](https://github.com/folio-org/stripes-components/tree/v13.0.3) (2025-03-27)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.2...v13.0.3)

* Restore onSelect support for AutoSuggest component. Refs STCOM-1426.

## [13.0.2](https://github.com/folio-org/stripes-components/tree/v13.0.2) (2025-03-24)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.1...v13.0.2)

* Add loading indicator to `AuditLogPane` when data is initially loading. Refs STCOM-1422.
* CSS Support for printing of results list content. Refs STCOM-1417.

## [13.0.1](https://github.com/folio-org/stripes-components/tree/v13.0.1) (2025-03-12)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v13.0.0...v13.0.1)

* MultiSelection - pass `dirty` and `isValid` props from the form field wrapper. Refs STCOM-1409.
* Introduce `<AuditLog>` component. Refs STCOM-1412.
* `AuditLog` - Add original version card. Refs STCOM-1416.
* `AuditLog` - Show current version for the newest card. Refs STCOM-1415.
* `AuditLog` - add `modalFieldChanges` to display field change in card modal window, make modal large, add totalVersions. Refs STCOM-1419.

## [13.0.0](https://github.com/folio-org/stripes-components/tree/v13.0.0) (2025-02-24)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.2.0...v13.0.0)

* `TextArea` - move focus to the field after clearing the field by clicking on the `x` icon. Refs STCOM-1369.
* Change `Repeatable field` focus behaviour. Refs STCOM-1341.
* Fix `<Selection>` bug with option list closing when scrollbar is used. Refs STCOM-1371.
* `<Selection>` - fix bug handling empty string options/values. Refs STCOM-1373.
* Include Kosovo in the countries list. Refs STCOM-1354.
* `<RepeatableField>` - switch to MutationObserver to resolve focus-management issues. Refs STCOM-1372.
* Bump `stripes-react-hotkeys` to `v3.2.0` for compatibility with `findDOMNode()` changes. STCOM-1343.
* Pin `currency-codes` to `v2.1.0` to avoid duplicate entries in `v2.2.0`. Refs STCOM-1379.
* Wrap `<Selection>` in full-width div. Refs STCOM-1332.
* Assign `<Modal>`'s exit key handler to Modal's element rather than `document`. refs STCOM-1382.
* Wrap `<Card>`'s render output in `<StripesOverlayContext>` to facilitate ease with overlay components. Refs STCOM-1384.
* Clear filter value after an action chosen from `MultiSelection` menu. Refs STCOM-1385.
* ExportCSV - fix usage within `<Modal>`s by rendering the download link to the `div#OverlayContainer`. Refs STCOM-1387.
* `<MenuSection>` should default its heading/label tag to `H3` instead of `H1`. Refs STCOM-1392.
* `<Datepicker>` fix for `<Calendar>` tabIndex when changing the year. Refs STCOM-1395.
* `<Tooltip>` should allow for tooltip content to be hovered without closing the tooltip. Refs STCOM-1391.
* `<AdvancedSearchRow>` - change `aria-label` for the input box to enter a search query and the Boolean operator dropdown. Refs STCOM-1195.
* *BREAKING* Update `@csstools` postcss plugins to current versions in sync with `@folio/stripes-cli`. Refs STCOM-1404.
* Paneset - deduplicate panes via `id` prior to registration. Refs STCOM-1386.
* Calendar - improved color contrast of edge month days, as per WCAG standards. Changed hover bg color of edge/month days. Increased weight of day numbers overall. Refs STCOM-1390.
* *BREAKING* Update `react-intl` to `^7`. Refs STCOM-1406.
* *BREAKING* remove deprecated props. Refs STCOM-1398.
* Add marginTop0 prop to the MessageBanner component. Refs STCOM-1408.
* Popper - hide overlay if popper anchor is scrolled out of the view. Refs STCOM-1386.
* Switch `useRootClose` hook to `useOClickOutside`. Refs STCOM-1339.
* Removed `react-overlays` dependency. Refs STCOM-1336.

## [12.2.0](https://github.com/folio-org/stripes-components/tree/v12.2.0) (2024-10-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.1.0...v12.2.0)

* Add specific loading props to MCL to pass to Prev/Next pagination row, Refs STCOM-1305
* Exclude invalid additional currencies. Refs STCOM-1274.
* Validate ref in `Paneset` before dereferencing it. Refs STCOM-1235.
* Resolve bug with form control validation styles not rendering. Adjusted order of nested selectors. Refs STCOM-1284.
* `<MultiSelection/>`'s overlay will use the overlay container as its boundary when the `renderToOverlay` prop is applied, as opposed to the scrollParent of the control. Refs STCOM-1282.
* Add `isCursorAtEnd` property to `TextArea` to place the cursor at the end of the value. Refs STCOM-1289.
* Focus the last modified query field when opening `<AdvancedSearch>`. Refs STCOM-1288.
* Avoid deprecated `defaultProps` for functional components. Refs STCOM-1291.
* Use user agent colors for native `<Select>` selected `<option>`s. Refs STCOM-1287.
* Add a "Save & keep editing" translation. Refs STCOM-1296.
* Add `dndProvided` prop to the `<MCLRenderer>` to render a placeholder for a draggable row. Refs STCOM-1297.
* Adjust styles for links within default `<MessageBanner>`. Refs STCOM-1276.
* Support Optimistic Locking in Tags - allow disable and show loading indicator in MultiSelect. Refs STCOM-1299.
* Update `downshift` dependency. Refactor `<Selection>`, `<MultiSelection>`, `<AutoSuggest>` to functional components. Refs STCOM-1091.
* Implement option grouping feature in `<Selection>`. Refs STCOM-1278.
* Refactor `<Callout>` styles for Firefox compatibility.
* Adjust focus styling for color contrast in main navigation. Refs STCOM-1301.
* Wrap `<Selection>` value string in exclusive element. Apply `name` attribute to `<Selection>` control. Refs FAT-14783.
* Correctly apply supplied `ariaLabelledby` prop in `<MultiSelection`>. Refs FAT-14783.
* Add translation for `<MultiSelection>` dropdown trigger. Refs FAT-14783.
* Apply correct widths for `<MultiSelectOptionsList>`. Refs STCOM-1308.
* Pass the `isCursorAtEnd` property to the textarea props in the `SearchField` component. Refs STCOM-1307.
* Use `isEqual` to dedupe multiSelection values list rather that `===`. Refs STCOM-1311.
* Set `<MultiSelection>`'s popper modifiers to avoid overlap with the control when rendered within an Editable list. Refs STCOM-1309.
* Conform `<Selection>`'s internal state when value prop changes after initial render. Refs STCOM-1312.
* Conform `<MultiSelection>`'s internal state when the value prop changes after the initial render. Refs STCOM-1311.
* Make `<MultiSelection>` less strict about item removal via `itemToKey` setting (`downshift`). Refs STCOM-1311.
* Conform `<Selection>`'s internal state when dataOptions prop changes after initial render. Refs STCOM-1313.
* Add the `showSortIndicator` property to MLC to display a sort indicator next to the sortable column names. Refs STCOM-1328.
* Expose `aria-label` for SearchField Index `<Select>`. Refs STCOM-1329.
* `<FilterAccordionHeader>` - move focus to accordion header after clear button is pressed. Refs STCOM-1330.
* Remove `tabIndex="-1"` from `<Datepicker>`'s clear button, placing it in tab order. Refs STCOM-1322.
* `<MultiSelection>` Bugfix - remove filter value after an item is selected. Refs STCOM-1324.
* Fix visual issue with `<Selection>` where dropdown caret shifts downward when a validation message is present. Refs STCOM-1323.
* Fix MCL Paging bug - back button being incorrectly disabled. This was due to an inaccurate rowcount/rowIndex value. Refs STCOM-1331.
* `Datepicker` - add the `hideCalendarButton` property to hide the calendar icon button. Refs STCOM-1342.
* Optimize rendering of 2k+ option lists in `Selection`. Refs STCOM-1340.
* Refactor Modals away from `react-overlays`. Refs STCOM-1334.
* Apply `inert` attribute to header and siblings of `div#OverlayContainer` when modals are open. Refs STCOM-1334.
* Expand focus trapping of modal to the `div#OverlayContainer` so that overlay components can function within `<Modal>` using the `usePortal` prop. Refs STCOM-1334.
* Render string for `FilterGroups` clear button. Refs STCOM-1337.
* Add OverlayContext for Overlay-style components rendered within Modals and MCL's. Refs STCOM-1335.
* Refactored away from `findDOMNode` in codebase for React 19 preparation. Refs STCOM-1343.
* AdvancedSearch - added a wrapping div to ref for a HotKeys ref. Refs STCOM-1343.
* `<MultiColumnList>` components `<CellMeasurer>` and `<RowMeasurer>` updated to use refs vs `findDOMNode`. Refs STCOM-1343.
* `<AccordionHeaders>` are wrapped with a div for use as a HotKeys ref. Refs STCOM-1343.
* Use whole `dataOptions` array for memoization dependency rather that just `length` property. STCOM-1346.
* Default the scope of `<CommandList>` to `document.body`. Remove internal wrapping div. Refs STCOM-1351.
* Remove inline styling from `<Modal>` content. Refs STCOM-1348.
* Use `<Selection>`'s formatter for rendering the selected value within the field and prevent overflow of text. Refs STCOM-1344.
* Export `<StripesOverlayWrapper>` that will automatically apply the `usePortal` behavior to nested overlay components. Refs STCOM-1353.
* Properly pass `readOnly` prop to `<RadioButton>`'s internally rendered `<Label>`. Refs STCOM-1367.

## [12.1.0](https://github.com/folio-org/stripes-components/tree/v12.1.0) (2024-03-12)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.0.0...v12.1.0)

* Add `hasMatchSelection` to `<AdvancedSearch>` to hide/show search match selection dropdown. Refs STCOM-1211.
* Add z-index of 1 to callout out to have it always render on top of sibling elements. Fixes STCOM-1217.
* Make `<SearchField>` support input and textarea as an input field. Refs STCOM-1220.
* Add support for new match option `containsAll` in `<AdvancedSearch>`. Refs STCOM-1223.
* Ensure CSS visibility of datepicker's year input number spinner. Refs STCOM-1225.
* Include pagination height in MCL container height calculation. Refs STCOM-1224.
* Added `indexRef` and `inputRef` props to `<SearchField>`. Refs STCOM-1231.
* Adjusted print styles of panes so that the last pane will print. Refs STCOM-1228, STCOM-1229.
* Accessibility Issues - stripes components. Refs STCOM-1222.
* Enable spinner on Datepicker year input. Refs STCOM-1225.
* TextLink - underline showing up on nested spans with 'display: inline-flex'. Refs STCOM-1226.
* Use the default search option instead of an unsupported one in Advanced search. Refs STCOM-1242.
* Added support for clear icon in `<TextArea>`. Refs STCOM-1240.
* Bug fix for Accordion content z-index rendering. Refs STCOM-1238.
* Format aria attributes in `<Icon>`. Refs STCOM-1165.
* Upgrade `stylelint` and fix errors. Refs STCOM-1087.
* Show action buttons in correct color. Refs STCOM-1256.
* Accessibility | Repeatable Field Component. Refs STCOM-766.
* Apply highest z-index to focused `<Accordion>` within `AccordionSet`. Refs STCOM-1257.
* Upgrade storybook to v7. Refs STCOM-1176.
* Fix bug with MCL not re-enabling paging buttons after more data was loaded. Refs STCOM-1262.
* Accessible grouping for filter group checkboxes via `role="group"`. Refs STCOM-1192.
* Fix `<FilterAccordionHeader>` does not have correct `aria-label` when `label` prop type is string. Fixes STCOM-1271.
* Add `number-generator` icon. Refs STCOM-1269.
* Accordions retain their z-index after being blurred, and assume the highest z-index when focus enters them. Refs STCOM-1238.
* `<Selection>` should only move focus back to its control/trigger if focus within the list. Refs STCOM-1238.
* Add DayJS export and Date/Time utilities. Refs STCOM-1094/

## [12.0.5](https://github.com/folio-org/stripes-components/tree/v12.0.4) (2024-02-28)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.0.4...v12.0.5)

* MCL loading bugfix - Refs STCOM-1262.

## [12.0.4](https://github.com/folio-org/stripes-components/tree/v12.0.4) (2023-11-10)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.0.3...v12.0.4)

* Display spinner on Datepicker year input. Refs STCOM-1225.

## [12.0.3](https://github.com/folio-org/stripes-components/tree/v12.0.3) (2023-11-10)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.0.2...v12.0.3)

* Add z-index of 1 to callout out to have it always render on top of sibling elements. Fixes STCOM-1217.
* Ensure CSS visibility of datepicker's year input number spinner. Refs STCOM-1225.
* Include pagination height in MCL container height calculation. Refs STCOM-1224.
* Adjusted print styles of panes so that the last pane will print. Refs STCOM-1228, STCOM-1229.
* Accessibility Issues - stripes components. Refs STCOM-1222.

## [12.0.2](https://github.com/folio-org/stripes-components/tree/v12.0.2) (2023-10-20)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.0.1...v12.0.2)

* Add `hasMatchSelection` to `<AdvancedSearch>` to hide/show search match selection dropdown. Refs STCOM-1211.

## [12.0.1](https://github.com/folio-org/stripes-components/tree/v12.0.0) (2023-10-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v12.0.0...v12.0.1)

* Bump `@folio/stripes-testing` to `v4.6.0` for new interactors.

## [12.0.0](https://github.com/folio-org/stripes-components/tree/v12.0.0) (2023-10-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v11.0.0...v12.0.0)

* Add `rootClass` and `fitContent` props to `<TextArea>`. Refs STCOM-1101.
* Fix bug with Timepicker formatting user input too quickly/aggressively. Refs STCOM-1103.
* Fix big with Timepicker timedropdown spinners not respecting their appropriate ranges. Refs STCOM-1104.
* Fix Timepicker dropdown not spinning values when the value is empty/undefined. Refs STCOM-1118.
* Timepicker conforms to redux-form's expected blur behavior. Refs STCOM-1119.
* Add optgroup example  of `Select` component in storybook. Refs STCOM-1121.
* Fix Convert24hr function of timepicker to fix 'invalid date' message when timedropdown is used. Refs STCOM-1120.
* Fix MCL Columnheaders' focus styling. Refs STCOM-1105.
* Fix keyboard interaction with MCL Columnheaders - Enter and Spacebar can now be used to 'click' them. Refs STCOM-680.
* The Datepicker works correctly with an invalid date. Refs STCOM-1110.
* Implement timeZone support in `<Timepicker/>` default output formatter. Refs STCOM-1128.
* Internalize the react-flexbox-grid dependency. Refs STCOM-1127.
* Set TextLink color to white on selected MCL rows. Refs STCOM-1122.
* Timepicker considers timezone when parsing value prop. Refs STCOM-1141.
* PaneContent div should be position: relative to hide overflow from absolutely positioned contents. Refs STCOM-1148.
* Adjust styles for overlay controls rendered in MCL rows. Refs STCOM-1149, UIRS-100.
* Provide onChange and ariaLabel prop to TextArea component. Refs STCOM-1154.
* Omit `webpack` dependency; it is not used directly and is supplied indirectly via `@folio/stripes-cli`. Refs STCOM-1153.
* Add styling for search fields to remove the `x` cancel icon that went away when we upgraded `normalize.css` . Refs STCOM-1157.
* Remove Accordion's problematic internal aria-label (it already has aria-labelledby for adequate labeling). Refs STCOM-1129.
* Compile translations. Refs STCOM-1162.
* Return filled rows and query from `useAdvancedSearch` hook. Fixes STCOM-1156.
* Remove `dom-helpers` dependency. Resolves STCOM-1170.
* Center MCL prev-next pagination to scrollParent. Resolves STCOM-1158.
* Add style to `<TextLink>` to account for interactionStyles' `:active` style. Refs STCOM-1159.
* Upgrade `postcss-calc` from v8 to v9.0.1. Refs STCOM-1174.
* Upgrade `react-transition-group` from 2.9.0 to 4.4.5. Refs STCOM-1175.
* Expand options of MetaSection component. Refs STCOM-1171.
* Provide the searchableOptions prop to the SearchField component to use it as children for options in the Select component. Refs STCOM-1183.
* Provide the `getFieldUniqueKey` prop to define a `key` for the list items in the `<RepeatableField>` component. Refs STCOM-1186.
* Bugfix for `<MultiSelection>` - onRemove should support remove button clicks and list de-selection as it does backspace. Refs STCOM-1106.
* *BREAKING* bump `react` to `v18`. Refs STCOM-1179.
* Add `graph` icon. Refs STCOM-1187.
* `<AccordionSet/>` bugfix - fix for Accordions reverting to their initial open/close state when outer component is updated. Fixes STCOM-1188.
* Unpin `moment` from `2.24`; STRIPES-678 resolved long ago. Resolves CVE-2022-24785.
* Always display spinner buttons on `input[type="number"]`. Resolves STCOM-1185.
* Add `pagingOffset` prop to `<MultiColumnList/>`. Resoves STCOM-1189.
* Adjust scroll position to the top for non-sparse array. Resolves STCOM-1196.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs STCOM-1198.
* Add `current` for `selectList` and `container` refs due to removal of dom-helpers dependency. Refs STCOM-1199.
* Fix focus of first row and prevent multiple focus calls in MCLRenderer. Fixes STCOM-1202.
* Move prev/next pagination outside of MCL's scrollable div. Refs STCOM-1115.
* Reset the `loading` state for the sparse array in `MCLRenderer`, not just the non-sparse. Fixes STCOM-1203.
* Bump `@svgr/webpack` from `7.0.0` to `8.1.0`.
* Update/unbreak `expandAllSections` and `collapseAllSections` keyboard shortcuts to work with updated `<AccordionStatus>` code. Fixes STCOM-1207.
* Correctly handle multiple `<Callout>` elements when they are manipulated quickly. Refs STCOM-1209.
* Make Advanced search query boxes expandable. Fixes STCOM-1205.
* Fix state mutation in `<AccordionSet>`. Add `onRegisterAccordion` and `onUnregisterAccordion` props. Refs STCOM-1210.
* Italian locale: provide correct value for `NL` country code. Refs STCOM-1216

## [11.0.0](https://github.com/folio-org/stripes-components/tree/v11.0.0) (2023-01-30)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.3.0...v11.0.0)

* `<Paneset>` initializes state more thoroughly, avoiding nulls. Refs STCOM-1056.
* After click submit button disable the confirmation button in Confirmation modal component. Refs STCOM-1058
* FOLIO Login screen missing scrollbar - removed global styling for body overflow. Refs STCOM-1059.
* Correctly configure SonarCloud to find coverage reports. Refs STCOM-1064.
* Add 'centered' property to the 'RadioButton' component. Refs STCOM-1065.
* Prevent Popover from leaking escape keypress events. Refs STCOM-1061.
* *BREAKING:* Remove properties and components labeled as "deprecated". Refs STCOM-1067.
* Enable dependabot. Refs STCOM-1068, FOLIO-3664.
* Fix link in focused MCL row not working. Fixes STCOM-1066.
* Loosen prop-types for `<TextLink>`. Refs STCOM-1076.
* Replace tyop in `<Accordion>`'s test-id. Refs STCOM-1079.
* *BREAKING:* Upgrade `react-redux` to `v8`. Refs STCOM-1080.
* Fix bug with MCL columnwidths not updating with width hint API. Refs STCOM-1090.
* Add line break at newline characters. Refs STCOM-1097.

## [10.3.0](https://github.com/folio-org/stripes-components/tree/v10.3.0) (2022-10-13)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.2.0...v10.3.0)

* Fix 12-hour formatting in `dateTimeUtils` `getLocalizedTimeFormatInfo`. Fixes STCOM-1017
* Add `inputRef` prop to `<Timepicker>`. Refs STCOM-1016
* `<MultiDownshift>` - highlight first item when searching for options. Fixes STCOM-1015
* Long titles do not fit in the confirmation modal window header. Refs STCOM-1020
* Pass `modifiers` prop to correct component in `<MultiSelection>`. Fixes STCOM-1013.
* Add `inputRef` prop to `<Selection>`. Refs STCOM-647.
* `<MultiSelection>` must handle null filter string. Refs STCOM-1022.
* Break long words in Callout message. Refs STCOM-1023.
* Add underline to Button focus indicator. Refs STCOM-1007
* Fix selection bug where pressing the enter key while no options are available will clear the selected value. fixes STCOM-1024.
* Fix TextField bug where "focused" state is retained if component is disabled while it's in focus. fixes STCOM-818.
* Provide ability to disable an Icon Button. Refs STCOM-1028.
* `MultiSelection` support for `aria-label`. Refs STCOM-977.
* Fix regex matching of search options in `<AdvancedSearch>`. Fixes STCOM-1031.
* Export `staticFirstWeekDay` and `staticLangCountryCodes` from `Datepicker`. Refs STCOM-1038.
* Button: Button link style has a min-height, which can offset it from text. Fixes STCOM-1039.
* The vertical scroll bar displays at the second pane when it doesn't need. Fixes STCOM-1044.
* Focus management and accessible labeling of confirmation modals. Confirmation modals announce in a way similart to Javascript alerts. Fixes STCOM-1041.

## [10.2.0](https://github.com/folio-org/stripes-components/tree/v10.2.0) (2022-06-14)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.1.0...v10.2.0)

* Prevent `onMount` from being passed to rendered HTML element in `<Pane>`. fixes STCOM-931
* Include percentage-based layout widths in proportional resizing. fixes STCOM-927.
* Prevent caching of pane layouts (resizeable widths) when panes do not have a provided stable `id` prop. fixes STCOM-932.
* AccordionSet has incorrect aria attribute. Refs STCOM-937.
* NoValue component doesn't have role. Refs STCOM-936.
* Correctly apply `aria-haspopup` and `aria-expanded` to IconButton. Refs STCOM 941.
* Open Loans List: Elements must only use allowed ARIA attributes. Refs STCOM-948.
* Appropriately apply labels within `<AutoSuggest>` component. Refs STCOM-939.
* Correct Arabic and Japanese `font-family` typos. Refs STCOM-950.
* Provide `<NoValue>` interactor. Refs STCOM-949.
* Export to CSV not handling diacritics. Fixes STCOM-951.
* Correctly label focus-trap control in `<Timepicker>`. Refs STCOM-945.
* Add rendered text to the control of `<Selection>`. Refs STCOM-942.
* Avoid `setState` calls in unmounted components. Refs STCOM-952.
* Break long words in headings based on zooming 200%. Refs STCOM-835.
* Improve splitting search query into rows in <AdvancedSearch>. Fixes STCOM-955.
* Fix cropping of nested panesets. Fixes STCOM-953.
* Lock-off `postcss-custom-properties` to 12.1.4. Fixes STCOM-956.
* eHoldings app: Package Detail Record> Usage & analysis accordion > Apply pagination to Titles list. Refs STCOM-966.
* Fix Accessibility problems for "MultiSelection" component. STCOM-967.
* Add `marginBottom0` prop to `<Timepicker>`. Refs STCOM-968
* Update `autoprefixer` to maintain compat with `postcss`. Refs STCOM-963.
* Fix prop types of `<IconButton>`. Fixes STCOM-972.
* Add Cancel icon. Refs STCOM-976.
* Export `<Calendar>` component as standalone. Refs STCOM-850
* Export all exports from `<FilterGroups>`. Refs STCOM-980.
* Add background-color to `<Select>` options for FF UA styles. Fixes STCOM-974.
* Set Monday as first day of the week for `es-419`. Refs STCOM-985.
* The schedule time does not accept PM value. Fixes STCOM-986.
* Handle panesets containing only percentage-based panes differently. Fixes STCOM-983
* In mixed px and non-px panesets, resize caches only for px-based widths. Fixes STCOM-982
* Resize non-cached paneset layouts on window resize. Fixes STCOM-984.
* Button: 'Link' style should behave as expected. Fixes STCOM-938.
* Resized nested paneset containing elements. Fixes STCOM-989.
* Hours format on Timepicker consistent to locale. Fixes STCOM-947.
* Extend proptypes for avoiding console errors. Fixes STCOM-994.
* Added `pagingCanGoNext` and `pagingCanGoPrevious` props to `<MultiColumnList>`. Refs STCOM-995.
* Break long words in (checkbox) labels. Fixes STCOM-990.
* Remove paginationBoundaries prop from MCLRenderer and PrevNextPaginationRow components. Refs STCOM-999.
* Paneset logic handles container widths of 0. Refs STCOM-1004.
* properly provide popper placements. Fixes STCOM-979.
* Additional functionality needed for metadata display when user record is deleted. Refs STCOM-882.
* Add the ability to pass a className to the rows container in the `<MultiColumnList>`. Refs STCOM-1009.
* MultiSelection - fix exception when using special characters in search string. Fixes STCOM-1010.
* Browse contributors > Second pane should not show a horizontal scrollbar. Fixes STCOM-1011.
* Record detail panes are empty when printed. Refs STCOM-975.
* The "Are you sure?" modal window doesn't close when pressing on the "ESC" keyboard button. Refs STCOM-1054.

## [10.1.5](https://github.com/folio-org/stripes-components/tree/v10.1.5) (2022-06-06)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.1.4...v10.1.5)

* Set Monday as first day of the week for `es-419`. Refs STCOM-985.
* Migrate Node JS to active LTS, v16. Refs STCOM-996.
* Include recent `zh-TW` translations. Refs STCOM-1003.

## [10.1.4](https://github.com/folio-org/stripes-components/tree/v10.1.4) (2022-06-01)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.1.3...v10.1.4)

* Handle panesets containing only percentage-based panes differently. Fixes STCOM-983
* In mixed px and non-px panesets, resize caches only for px-based widths. Fixes STCOM-982
* Resize non-cached paneset layouts on window resize. Fixes STCOM-984.
* Check for window resize in `calcWidths`. Refs STCOM-987.
* resize-nested paneset containers. Refs STCOM-988.
* Resized nested paneset containing elements. Fixes STCOM-989.

## [10.1.3](https://github.com/folio-org/stripes-components/tree/v10.1.3) (2022-04-04)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.1.2...v10.1.3)

* Prevent caching of pane layouts (resizeable widths) when panes do not have a provided stable `id` prop. fixes STCOM-932.
* Fix cropping of nested panesets. Fixes STCOM-953

## [10.1.2](https://github.com/folio-org/stripes-components/tree/v10.1.2) (2022-03-28)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.1.1...v10.1.2)

* Prevent `onMount` from being passed to rendered HTML element in `<Pane>`. fixes STCOM-931.

## [10.1.1](https://github.com/folio-org/stripes-components/tree/v10.1.1) (2022-03-24)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.1.0...v10.1.1)

* Export to CSV not handling diacritics. Fixes STCOM-951.
* Advanced search does not work when editing Advanced Search box. Refs STCOM-934.
* Improve splitting search query into rows in `<AdvancedSearch>`. Fixes STCOM-955.

## [10.1.0](https://github.com/folio-org/stripes-components/tree/v10.1.0) (2022-02-11)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v10.0.0...v10.1.0)

* Export utilities for apps to display keyboard shortcuts in a modal.Refs STCOM-865.
* upgraded popover tests to use new interactors. part of STCOM-880.
* removing skipped tests for TextField, Radiobutton, Select. Fixes STCOM-880.
* Re-fix issue with misaligned dates/weekdays in Datepicker Calendar. Add regression tests for fix. Refs STCOM-849.
* Add new `textLeft` className to `<Layout>` component. Refs STCOM-897.
* Check that content inside `<Accordion>` was clicked and set focus flag. Refs STCOM-895.
* Add an event handler for accordion opening/closing at users' direct request. Refs STCOM-820.
* Remove default tabIndex from Icon (cause of nested interactive axe errors), treated aria-labelledby appropriately in IconButton. Fixes STCOM-883
* Make `useClickOutside` click handler work on `capture` event phase. Refs STCOM-895.
* Interactors should not use dynamic CSS variable names. Refs STCOM-902.
* Create a Conflict Detection banner. Refs STCOM-889.
* Scroll MCL to top when a shorter list of content is received. Refs STCOM-907
* Fix issue with radioButton 'button' not responding to clicks. Fixes STCOM-910.
* Upgrade `postcss` to v8. Refs STCOM-892.
* Add a new `valueFormatter` prop to `<MultiSelection>`. Refs STCOM-911.
* remove `@bigtest/mocha` dependency - using `mocha` instead. Refs STCOM-907.
* Do not pass `aria-invalid` to any `<button>` elements. Refs STCOM-915.
* PrevNext buttons return incorrect index. Fixes STCOM-909.
* Add new `text-start`, `text-end` classNames to `<Layout>` component. Refs STCOM-898.
* Add `<AdvancedSearch>` component. Refs STCOM-919.
* Strange arrow appears in select (multiple=true) boxes over scrollbar. Refs STCOM-925.
* Add onMount prop to the Pane component. Refs STCOM-928
* Advanced search does not work when editing Advanced Search box. Refs STCOM-934.
* Add `usePortal` prop to `<Timepicker>`. Refs STCOM-969.

## [10.0.0](https://github.com/folio-org/stripes-components/tree/v10.0.0) (2021-09-26)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v9.2.0...v10.0.0)

* Add link icon. Refs STCOM-852.
* `<MultiColumnList>` add ability to focus component if content data is empty. Refs STCOM-851.
* Expose getLocaleDateFormat Datepicker util. Refs STCOM-854.
* Fix issue with misaligned dates/weekdays in Datepicker Calendar. Refs STCOM-849
* `<Datepicker>` must correctly handle RFC-2822 dates. Refs STCOM-861.
* `<Datepicker>` always provides Arabic numerals (0-9) given `backendDateStandard` to format values. Refs STCOM-860.
* `<SingleSelect>` add new `loading` and `loadingMessage` props to display while loading options. Refs STCOM-858.
* Applied maxheight to `<DropdownMenu>`. Fixes STCOM-848
* Fix `<Datepicker>` `inputRef` prop not working. Refs STCOM-869
* Scope the focusable row to the scroll container. Refs STCOM-870
* Fix issue when staff slips generate an extra blank page. Refs STCOM-872
* Use existing Bigtest Interactors from stripes-testing instead of local bigtest interactors. Refs STCOM-862
* React 17. STCOM-797.
* Closing `<Popover>`, `<InfoPopover>` should send focus back to the trigger. Fixes STCOM-867.
* Update `react-overlays` to v4. Refs STCOM-877.
* Disable several unit tests that either don't like `react` `17` or `react-overlays` `v4`. Refs STCOM-880.

## [9.2.0](https://github.com/folio-org/stripes-components/tree/v9.2.0) (2021-06-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v9.1.0...v9.2.0)

* `<IconLabel>` Avoid passing `aria-label` to a `<span>`, an a11y violation. Refs STCOM-834.
* `<CommandList>` should not warn about overriding system key bindings. Refs STCOM-836.
* `<Selection>` no longer always shows a `props.tether` deprecation warning. Refs STCOM-838.
* `<Paneset>` should not call `setState` after unmounting. Refs STCOM-833.
* Add `buttonLabel` to `<ErrorModal>`. Refs STCOM-841.
* Add `prev-next` pagination option to MCL. Refs STCOM-829
* Add support for sparse arrays to MCL. Refs STCOM-829
* Add `ItemToView` functionality so that item-based scroll positions can be marked by modules. Resolves STCOM-830.
* Formally export `exportToCsv`. Refs STCOM-843.
* Copy features and bugfixes from the `stripes-util` dupe of `exportToCsv`. Refs STCOM-844.
* `<MultiColumnList>` validate container-ref before calling functions on it to avoid NPEs.
* Fix issue with persisted panesets not adjusting to changed window sizes. Fixes STCOM-842.

## [9.1.0](https://github.com/folio-org/stripes-components/tree/v9.1.0) (2021-04-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v9.0.0...v9.1.0)

* Fix Accordion content is displayed below other accordions when using scrollbar. Fixes STCOM-812.
* Add languageOptionsES for the laguage facet. Refs UISEES-29.
* Fix Pane behavior on window resize/3rd pane/nested paneset resize. Fixes STCOM-808.
* Add the `<ErrorModal>` component. Refs STCOM-794.
* Add `check-in` icon. Refs UX-427.
* Add `check-out` icon. Refs UX-428.
* Add `KeyboardShortcutsModal` component. Refs STCOM-811.
* Fix incorrect date from `<Datepicker>` when using `YYYY-MM-DD` formatting and hidden input. Fixes STCOM-822.
* Set `max-width` on `textarea` elements, not just on their wrappers. Refs STCOM-824.

## [9.0.0](https://github.com/folio-org/stripes-components/tree/v9.0.0) (2021-02-25)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v8.0.0...v9.0.0)

* Make Select tooltip-ready (inputRef, aria-labelledby). Refs UITEN-119
* Fix focusing SearchField when loading - make it readOnly. Refs STCOM-762
* Refactor `Timepicker` away from `componentWillReceiveProps` lifecycle hook. Refs STCOM-275
* Handle DST in `Timepicker` tests.
* Add `isDisabled` property to `CheckboxInteractor`. Refs STCOM-777.
* Implement info callout. Refs STCOM-776.
* Implement warning callout. Refs STCOM-809.
* Set modalRoot position to absolute to allow for modals to stack. Refs STCOM-771.
* Provide `useDateFormatter` and `useTimeFormatter` hooks. Refs STCOM-775.
* `Datepicker` calendar weekday rendering bug. Fixes STRIPES-709.
* Fix Dropdown moving focus when external state changes. Fixes STCOM-778.
* Add Storybook example for <SRStatus>. Refs STCOM-424.
* Fix alignment of head labels in RepeatableField. Refs STCOM-787.
* Extend `Button` interactor with `isDisabled` field. Refs STCOM-792.
* Add `columnIdPrefix` prop to MCL. fixes STCOM-767.
* After the browser window is minimized the pane is not adjusted so the content on the righthand side is cut. Refs STCOM-783.
* Add `aria-label` attribute to modal root of `<Modal>` component. Refs UIEH-1017.
* Add `ariaLabel` prop to `<ConfirmationModal>`. Refs UIEH-1017.
* Correctly set `max-height` in expanded `<Accordion>`s. Refs STCOM-796.
* Add `className` prop to `<Accordion>`. Refs UIEH-926.
* Settings > Panes are off. Refs STCOM-795.
* Fix overflow in `sr-only` elements. Refs STCOM-801.
* `<ErrorBoundary>` accepts a callback to receive the arguments to `componentDidCatch`. Refs STCOM-753.
* Increment `@folio/stripes-cli` to `v2`. Refs STCOM-806.
* Updated disabled styles for `<Button>` to fix the poor contrast ratio issue. Fixes STCOM-813.
* Added `refresh`-icon. Refs UX-426.
* Deprecate `tether` prop on `<Autosuggest>` and `<Selection>`. Refs STCOM-789.
* Fix rendering default heading as `h3` tag for accordion of `<DefaultAccordionHeader>` component. Refs STCOM-815

## [8.0.0](https://github.com/folio-org/stripes-components/tree/v8.0.0) (2020-10-05)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v7.0.1...v8.0.0)

* Disable `SearchField` interactions if `loading` is true
* Avoid `ARIA attributes must conform to valid values` error on AutoSuggest field. Refs STCOM-720.
* Export currency options as a hook. Addition to STCOM-614.
* Provide `<CountrySelection>`. Fixes STCOM-291.
* Localize currency names in `<CurrencySelect>`. Fixes STCOM-614.
* Fix MultiSelect carat not aligned when there is not enough space.
* Updated `<Accordion>` a11y attributes and roles. Fixes STCOM-697.
* ARIA role must be appropriate for the element (Selection). Fixes STCOM-702.
* Add to `aria-label` descriptive text for filter headings. Refs STCOM-703.
* Display `<NoValue />` in KeyValue if value is undefined or empty string. New FOLIO UX guidelines. Refs STCOM-758
* Increment `react-router` to `^5.2`.
* Upgraded `react-overlays` dependency to the latest version. Refs STCOM-650.
* Add a utility list of language names & helper functions. Refs UIIN-829.
* Added `<TextLink>`-component. Refs STCOM-699.
* Extend `ConfirmationModal` interactor. STCOM-710.
* Added `lightning` icon. Refs UX-377.
* Fix layout of inputed MultiColumnList in Accordion. Refs STCOM-719.
* Added focus-within styles for `<Pane>`. Refs STCOM-477.
* Extend `getCellClass` callback with `rowData` and `column` name parameters. Introduced `getHeaderCellClass` callback prop to extend styling on the header cells. Refs STCOM-718
* Remove FilterPane component. Refs STCOM-688.
* Increase test coverage to 80% | Editor. Refs STCOM-660.
* Increase test coverage to 80% | FilterPaneSearch. Refs STCOM-689.
* Datepicker refactor: numerous fixes in accessibility, internationalization, usability. Addresses STCOM-325, STCOM-606, STCOM-684, STCOM-640, STCOM-577, STCOM-315, STCOM-653, STCOM-639, STCOM-470, STCOM-641.
* Support AutoSuggest field in react-final-form. Refs STCOM-725
* Extend `Pane` interactor with `header` field. STCOM-727.
* Fix missing label for MultiSelection hidden value input element. Refs STCOM-726.
* Fix `<SearchField>` component cannot be disabled. Refs STCOM-730.
* Fix `<Select>` component ignoring `required` property. Refs STCOM-742.
* Added `aria-hidden` attribute to `<Asterisk>` to prevent screen readers from reading it. Refs STCOM-741.
* Fix aria-labelledby prop on `<MultiSelection>` and added docs/example of usage with external label (STCOM-733)
* MultiColumnList `columnWidth` prop's keys will accept an object with `min` and `max` keys that can vary the size of the column based on necessity. Refs STCOM-631
* Fix a bug causing language name translation to crash if input is invalid. Fixes STCOM-745.
* Provide `<FormattedDate>` and `<FormattedTime>` to handle dates without properly formatted timezones. Refs STCOM-659.
* refactor SingleSelect away from componentWillReceiveProps. Refs STCOM-709.
* Add `autoFocus` property to `<MultiSelection>`. Refs UIEH-959.
* refactor SRStatus away from componentWillReceiveProps. Refs STCOM-708.
* Added `headerProps` property to `FilterAccordionHeader` and `DefaultAccordionHeader`. Refs STCOM-760.
* Move `moment` to `peerDependencies`. Refs STCOM-761.
* Change default `<FilterGroups>` operator from `=` to `==`. Refs STCOM-492.

## [7.0.1](https://github.com/folio-org/stripes-components/tree/v7.0.1) (2020-06-08)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v7.0.0...v7.0.1)

* Tweak `<Modal>` spacing so the top has better alignment.
* `react-hot-loader` is not provided by the platform.
* `<MultiColumnList>` a11y improvements. Refs UICHKOUT-602.
* Tooltips now hides when hitting escape. Refs STCOM-679.
* Changed focus proxy element in `<Popdown>` to a `div[tabIndex="0"]` instead of an `input`. Fixes STCOM-651.
* Use `UNSAFE_` prefix for deprecated React methods. We know, we know. Refs STCOM-649.
* `<MultiSelection>` handles small input fields more nicely.
* `<PasswordStrength>` must not set state if unmounted.
* Remove spurious `role` attribute from `<NoValue>`.
* Ensure `<TextField>` and `<TextArea>` are always associated with a `label`.
* Make it possible to disable interactivity for some column headers (Refs. STCOM-685)

## [7.0.0](https://github.com/folio-org/stripes-components/tree/v7.0.0) (2020-05-19)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v6.1.0...v7.0.0)

* Fix issue with `initialStatus` prop on Accordions not working.
* Fix bug with impossibility to use mouse to set Associated Service Point for Fee/Fine Owner. Refs UIU-1539.
* Introduce a new filter config property called `operator`. Refs STCOM-662.
* Expose `FILTER_GROUP_SEPARATOR` and `FILTER_SEPARATOR` for splitting/joing filters. Refs STCOM-670.
* a11y improvements for form components and update primary color. Refs STCOM-658.
* Fix aria-labelledby assignment on `<Multiselection>`. Refs UIREQ-437.
* Fixed text overflow bug on `<Select>`. Refs UX-341.
* Updated `<Timepicker>` to use `<Popper>` instead of react-tether. Refs STCOM-381.
* Added `centerContent `-prop for `<Pane>`. Refs STCOM-618.
* Allowed `to`, `href` and `labelStrings` props to be passed as functions to `defaultRowFormatter`. Refs STDTC-8.
* Pane resizing is suppressed when Panes are overlapped. Fixes STCOM-673, STCOM-674.
* Pin `moment` at `~2.24.0`. Refs STRIPES-678.
* Fix issue in tests with conflicting lists inside repeatable field. Refs UIDATIMP-442
* Increase test coverage to 80% | Dropdown menu. Refs STCOM-667.
* Increase test coverage to 80% | Selection. Refs STCOM-668.
* Added `unregisterAccordion` method to `<AccordionSet>` and unregistering of `<Accordion>` when unmounted. Refs STSMACOM-267.

## [6.1.0](https://github.com/folio-org/stripes-components/tree/v6.1.0) (2020-03-16)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v6.0.0...v6.1.0)

* Handle various different expand-all scenarios for `AccordionSet`. Refs STCOM-635.
* Provide `allocate`, `cart`, `drag-drop`, `receive`, and `transfer`icons.
* Correctly specify `SelectList` proptypes.
* Introduce a new filter config function called `parse`. Part of STCOM-654.
* Introduce `ariaLabel` prop on `<NoValue>`. Refs UIEH-832.
* Fix accessibility issues. Refs UICHKOUT-602.
* Converted `<Datepicker>` to use `<Popper>` instead of react-tether. STCOM-382.

## [6.0.0](https://github.com/folio-org/stripes-components/tree/v6.0.0) (2020-03-03)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.9.2...v6.0.0)

* Add deprecation warning for `hasMargin` prop passed to Card. Margin bottom is added by default now. Styling prop `marginBottom0` added to `<Card>` to remove the margin bottom if needed. (STCOM-626)
* Add `aria-labelledby` functionality to `<MultiSelection>`. fixes STCOM-627.
* Test coverage for `<FilterGroups>` at > 80%. Refs STCOM-610.
* Provide `<NoValue>` to show a `-` and handle `aria-label` correctly. Fixes STCOM-634.
* MCL percentage column widths summing to 100% no longer cause overflow. Fixes STCOM-633.
* Improve accessibility, add attribute `aria-label` to `nav` tag. Replace redundant tag `nav` with `div`. Refs UICAL-85.
* Test coverage for `<ExportCSV>` at > 80%. Refs STCOM-574.
* Introduce `bodyTag` prop on `<ConfirmationModal>`.
* Added `house`-icon (UX-302)
* Remove `<AppIcon>` and `SegmentedConrol` components.
* Remove deprecated props from ModalFooter (`primaryButton`, `secondaryButton`)
* Remove `AppIcon` prop usage as an object from `<PaneHeader>`.
* Move `react-intl`, `react-router-dom` to peerDependencies.

## [5.9.2](https://github.com/folio-org/stripes-components/tree/v5.9.2) (2019-12-19)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.9.1...v5.9.2)

* Export `countries`, `countriesByCode`, `countryCodes`, and localizable country names. Refs UICHKIN-146.

## [5.9.1](https://github.com/folio-org/stripes-components/tree/v5.9.1) (2019-12-09)
[Full Changelog](https://github.com/folio-org/stripes-components/compare/v5.9.0...v5.9.1)

* Change `autocomplete` attribute description in README.md. Refs UIU-1374.
* Support `ref` in Modal via `forwardRef``. Refs ERM-620
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
