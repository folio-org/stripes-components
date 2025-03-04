# stripes-components

Copyright (C) 2016-2019 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

<!-- md2toc -l 2 README.md -->
- [stripes-components](#stripes-components)
  - [Introduction](#introduction)
  - [Component categories](#component-categories)
  - [Links to documentation of specific components and utilities](#links-to-documentation-of-specific-components-and-utilities)
  - [Accessibility](#accessibility)
  - [Patterns](#patterns)
  - [Testing](#testing)
  - [FAQ](#faq)
  - [To be documented](#to-be-documented)
  - [Additional information](#additional-information)


## Introduction

This is a library of React components and utility functions for use with [the Stripes UI toolkit](https://github.com/folio-org/stripes-core/), part of [the FOLIO project](https://www.folio.org/).

## Storybook

A listing of our components with demonstrations and example usage can be found here:
https://folio-org.github.io/stripes-components

## Component categories

These are general descriptive categories that indicate the type of use cases that components serve. A component can have multiple categories associated with it.

Category | Description
--- | ---
**structure** | These are components that aid in the general structure/layout of your app's UI. They include generic containers and components that render structurally important HTML tags (`<Headline>`, for instance.)
**control** | Components with the control category are form elements and other interactive widgets including `<TextField>`, `<Button>` and `<Dropdown>` - additionally, this category includes components that aid the functionality of other control components, such as the way `<DropdownMenu>` is used with `<Dropdown>`
**data-display** | Data display components are used for display of dynamic content. These include `<List>` and `<MultiColumnList>`
**design** | These components render `<Icon>`s and other prominent visual landmarks.
**user-feedback** | These components are geared for making the user aware of happenings in the system. They include `<Callout>` and `<SRStatus>`.
**accessibility** | Components with this category play an important role in developing accessible modules.
**utility** | These components aid in interaction with the FOLIO system.
**prefab** | These components are re-useable pre-constructed components that make re-use of other shared components. Useful constructions such as `<AddressFieldGroup>` and `<EditableList>` fall into this category.
**obsolete** | Component has been replaced by better solution and is intended for removal in future releases.

## Links to documentation of specific components and utilities

The following components are available in the [lib](lib) directory.

Component | doc | categories
--- | --- | ---
[`<Accordion>`](lib/Accordion) | [doc](lib/Accordion/readme.md) | structure
[`<AdvancedSearch>`](lib/AdvancedSearch) | [doc](lib/AdvancedSearch/readme.md) | control
[`<AuditLog>`](lib/AuditLog) | [doc](lib/AuditLog/readme.md) | data-display
[`<AutoSuggest>`](lib/AutoSuggest) | [doc](lib/AutoSuggest/readme.md) | control
[`<Avatar>`](lib/Avatar) | [doc](lib/Avatar/readme.md) | data-display
[`<Badge>`](lib/Badge) | [doc](lib/Badge/readme.md) | data-display, design
[`<Button>`](lib/Button) | [doc](lib/Button/readme.md) | control
[`<ButtonGroup>`](lib/ButtonGroup) | [doc](lib/ButtonGroup/readme.md) | control
[`<Callout>`](lib/Callout) | [doc](lib/Callout/readme.md) | user-feedback
[`<Card>`](lib/Card) | [doc](lib/Card/readme.md) | structure
[`<Checkbox>`](lib/Checkbox) | [doc](lib/Checkbox/readme.md) | control
[`<Col>`](lib/LayoutGrid) | [doc](lib/LayoutGrid/readme.md) | structure
[`<Commander>`](lib/Commander) | [doc](lib/Commander/README.md) | utility
[`<ConfirmationModal>`](lib/ConfirmationModal) | [doc](lib/ConfirmationModal/readme.md) | control, prefab
[`<ConflictDetectionBanner>`](lib/ConflictDetectionBanner) | [doc](lib/ConflictDetectionBanner/readme.md) | user-feedback
[`<CountrySelection>`](lib/CountrySelection) |  | control
[`<CurrencySelect>`](lib/CountrySelection) |  | control
[`<Datepicker>`](lib/Datepicker) | [doc](lib/Datepicker/readme.md) | control
[`<DateRangeWrapper>`](lib/DateRangeWrapper) | [doc](lib/DateRangeWrapper/readme.md) | control
[`<Dropdown>`](lib/Dropdown) | [doc](lib/Dropdown/readme.md) | control
[`<DropdownButton>`](lib/DropdownButton) | [doc](lib/DropdownButton/readme.md) | control
[`<DropdownMenu>`](lib/DropdownMenu) | | control
[`<EditableList>`](https://github.com/folio-org/stripes-smart-components/tree/master/lib/EditableList) | [doc](https://github.com/folio-org/stripes-smart-components/blob/master/lib/EditableList/readme.md) | control, prefab
[`<Editor>`](lib/Editor) | [doc](lib/Editor/readme.md) | control
[`<EmptyMessage>`](lib/EmptyMessage) | [doc](lib/EmptyMessage/readme.md) | structure
[`<ErrorBoundary>`](lib/ErrorBoundary) | [doc](lib/ErrorBoundary/readme.md) | user-feedback
[`<ErrorModal>`](lib/ErrorModal) | [doc](lib/ErrorModal/readme.md) | user-feedback
[`<ExportCsv>`](lib/ExportCsv) | [doc](lib/ExportCsv/readme.md) | control
[`<FilterControlGroup>`](lib/FilterControlGroup) | | control
[`<FilterGroups>`](lib/FilterGroups) | [doc](lib/FilterGroups/readme.md) | control
[`<FilterPaneSearch>`](lib/FilterPaneSearch) | [doc](lib/FilterPaneSearch/readme.md) | obsolete
[`<FocusLink>`](lib/FocusLink) | [doc](lib/FocusLink/readme.md) | accessibility
[`<FormattedDate>`](lib/FormattedDate) | | data-display
[`<FormattedTime>`](lib/FormattedTime) | | data-display
[`<FormattedUTCDate>`](lib/FormattedUTCDate) | [doc](lib/FormattedUTCDate/readme.md) | data-display
[`<FormField>`](lib/FormField) | [doc](lib/FormField/readme.md) | control
[`<FormFieldArray>`](lib/FormFieldArray) | | control
[`<Headline>`](lib/Headline) | [doc](lib/Headline/readme.md) | structure
[`<Highlighter>`](lib/Highlighter) | [doc](lib/Highlighter/readme.md) | utility
[`<HotKeys>`](lib/HotKeys) | [doc](lib/HotKeys/readme.md) | utility
[`<Icon>`](lib/Icon) | [doc](lib/Icon/readme.md) | design
[`<IconButton>`](lib/IconButton) | [doc](lib/IconButton/readme.md) | control
[`<InfoPopover>`](lib/InfoPopover) | [doc](lib/InfoPopover/readme.md) | control, prefab
[`<KeyboardShortcutsModal>`](lib/KeyboardShortcutsModal) | [doc](lib/KeyboardShortcutsModal/readme.md) | utility
[`<KeyValue>`](lib/KeyValue) | [doc](lib/KeyValue/readme.md) | data-display
[`<Label>`](lib/Label) | [doc](lib/Label/readme.md) | control
[`<Layer>`](lib/Layer) | [doc](lib/Layer/readme.md) | structure
[`<Layout>`](lib/Layout) | [doc](lib/Layout/readme.md) | structure
[`<LayoutBox>`](lib/LayoutBox) | | structure
[`<LayoutGrid>`](lib/LayoutGrid) | [doc](lib/LayoutGrid/readme.md) | structure
[`<LayoutHeader>`](lib/LayoutHeader) | [doc](lib/LayoutHeader/readme.md) | structure
[`<List>`](lib/List) | [doc](lib/List/readme.md) | data-display
[`<Loading>`](lib/Loading) | [doc](lib/Loading/readme.md) | design
[`<LoadingPane>`](lib/Loading) | [doc](lib/Loading/readme.md) | design
[`<LoadingView>`](lib/Loading) | [doc](lib/Loading/readme.md) | design
[`<MenuItem>`](lib/MenuItem) | [doc](lib/MenuItem/readme.md) | control
[`<MenuSection>`](lib/MenuSection) | [doc](lib/MenuSection/readme.md) | control
[`<MessageBanner>`](lib/MessageBanner) | [doc](lib/MessageBanner/readme.md) | user-feedback
[`<MetaSection>`](lib/MetaSection) | [doc](lib/MetaSection/readme.md) | data-display
[`<Modal>`](lib/Modal) | [doc](lib/Modal/readme.md) | container
[`<ModalFooter>`](lib/ModalFooter) | [doc](lib/ModalFooter/readme.md) | container
[`<MultiColumnList>`](lib/MultiColumnList) | [doc](lib/MultiColumnList/readme.md) | data-display
[`<MultiSelection>`](lib/MultiSelection) | [doc](lib/MultiSelection/readme.md) | control
[`<NavList>`](lib/NavList) | [doc](lib/NavList/readme.md) | control
[`<NavListItem>`](lib/NavListItem) | | control
[`<NavListSection>`](lib/NavListSection) | | control
[`<NoValue>`](lib/NoValue) | [doc](lib/NoValue/readme.md) | accessibility
[`<Pane>`](lib/Pane) | [doc](lib/Pane/readme.md) | structure
[`<PaneBackLink>`](lib/PaneBackLink) | [doc](lib/PaneBackLink/readme.md) | control
[`<PaneCloseLink>`](lib/PaneCloseLink) | [doc](lib/PaneCloseLink/readme.md) | control
[`<PaneFooter>`](lib/PaneFooter) | [doc](lib/PaneFooter/readme.md) | structure
[`<PaneHeader>`](lib/PaneHeader) | [doc](lib/PaneHeader/readme.md) | structure
[`<PaneHeaderIconButton>`](lib/PaneHeaderIconButton) | [doc](lib/PaneHeaderIconButton/readme.md) | control
[`<PaneMenu>`](lib/PaneMenu) | [doc](lib/PaneMenu/readme.md) | control
[`<Paneset>`](lib/Paneset) | [doc](lib/Paneset/readme.md) | structure
[`<PaneSubheader>`](lib/PaneSubheader) | [doc](lib/PaneSubheader/readme.md) | structure
[`<PasswordStrength>`](lib/PasswordStrength) | [doc](lib/PasswordStrength/readme.md) | data-display
[`<Pluggable>`](https://github.com/folio-org/stripes-core/blob/master/src/Pluggable.js) | | utility
[`<Popover>`](lib/Popover) | [doc](lib/Popover/readme.md) | control
[`<Popper>`](lib/Popper) | [doc](lib/Popper/readme.md) | control
[`<RadioButton>`](lib/RadioButton) | [doc](lib/RadioButton/readme.md) | control
[`<RadioButtonGroup>`](lib/RadioButtonGroup) | [doc](lib/RadioButtonGroup/readme.md) | control
[`<RepeatableField>`](lib/RepeatableField) | [doc](lib/RepeatableField/readme.md) | control, prefab
[`<Row>`](lib/LayoutGrid) | [doc](lib/LayoutGrid/readme.md) | structure
[`<SearchField>`](lib/SearchField) | [doc](lib/SearchField/readme.md) | control, prefab
[`<Select>`](lib/Select) | [doc](lib/Select/readme.md) | control
[`<Selection>`](lib/Selection) | [doc](lib/Selection/readme.md) | control
[`<Settings>`](https://github.com/folio-org/stripes-smart-components/tree/master/lib/Settings) | [doc](https://github.com/folio-org/stripes-smart-components/blob/master/lib/Settings/readme.md) | prefab
[`<Spinner>`](lib/Spinner) | | design
[`<SRStatus>`](lib/SRStatus) | [doc](lib/SRStatus/readme.md) | accessibility, user-feedback
[`<TextArea>`](lib/TextArea) | | control
[`<TextField>`](lib/TextField) | [doc](lib/TextField/readme.md) | control
[`<TextLink>`](lib/TextLink) | [doc](lib/TextLink/readme.md) | control
[`<Timepicker>`](lib/Timepicker) | [doc](lib/Timepicker/readme.md) | control
[`<Tooltip>`](lib/Tooltip) | [doc](lib/Tooltip/readme.md) | data-display

There are also various [utility _functions_](util) (as opposed to React components), which are [documented separately](util/README.md).

## Accessibility
* [Accessibility overview](guides/accessibility/AboutAccessibility.stories.mdx) - general overview of some utilities that stripes-components provides.
* [Accessibility for developers](guides/accessibility/AccessibilityDevPrimer.stories.mdx) - dev-specific primer for accessibility. More direct code/component reference - a great intro for those who are unfamiliar to accessibility.

## Patterns
Useful recipes for UI patterns appearing in FOLIO modules.

* [Show/Hide Columns in MCL](guides/patterns/ColumnSelector.stories.mdx) -- Give users the ability to select only the data they need to see.
* [Accessible Routing](guides/patterns/AccessibleRouting.stories.mdx) -- Detail the approaches to implementing accessible focus management.

## Working with dates/times in UI-Modules

We provide a handful of components and utilities for date/time functionality.

* **Datepicker, Timepicker, DateRangeWrapper components** - UI-widgets for accepting date/time input.
* **FormattedDate, FormattedUTCDate, FormattedTime** - Cross-browser convenience components for displaying localized representations of system ISO8601 timestamps.
* [dateTimeUtils](util/DateUtils_readme.md) - A handful of utility functions for working with date/time code in application logic.
* **Hooks**
  * useFormatDate - presentational date-formatting.
  * useFormatTime - presentational time-formatting.
  * useDynamicLocale - loading DayJS locale information within functional components (also available in component form, via `DynamicLocaleRenderer`).

## Testing
Stripes Components' tests are automated browser tests powered by
[Karma](http://karma-runner.github.io) and written using
[Mocha](https://mochajs.org/), [Chai](https://github.com/chaijs/chai),
and [BigTest](https://bigtestjs.io/).

Component tests can be run by navigating to your `stripes-components`
folder and running

```
yarn test
```

This will spin up Karma via
[`stripes-cli`](https://github.com/folio-org/stripes-cli) and run all
tests locally in the Chrome browser.

See our [testing documentation](guides/Testing.stories.mdx) for more information
on writing tests.

## FAQ
Check our [Frequently asked questions for Module developers page](FAQ.md)

## To be documented

XXX Say something about
[`sharedStyles`](lib/sharedStyles/),
[`global.css`](lib/global.css)
and
[`variables.css`](lib/variables.css).


## Additional information

Some related documents:

* [Guide to UI Module Layout Components](guides/UIModuleLayout.stories.mdx)
* [CSS for stripes-components development](guides/CSSinStripes.stories.mdx)
* [Change-log](CHANGELOG.md)

See project [STCOM](https://issues.folio.org/browse/STCOM) (STripes COMponents)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker/).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
