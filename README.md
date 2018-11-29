# stripes-components

Copyright (C) 2016-2018 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

<!-- md2toc -l 2 README.md -->
* [Introduction](#introduction)
* [Component categories](#component-categories)
* [Links to documentation of specific components and utilities](#links-to-documentation-of-specific-components-and-utilities)
* [Patterns - UI Recipes](#patterns)
* [Testing](#testing)
* [FAQ](#faq)
* [Migration Paths](MIGRATIONPATHS.md)
* [Change Management](CHANGEMANAGEMENT.md)
* [To be documented](#to-be-documented)
* [Additional information](#additional-information)


## Introduction

This is a library of React components and utility functions for use with [the Stripes UI toolkit](https://github.com/folio-org/stripes-core/), part of [the FOLIO project](https://www.folio.org/).

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
[`<AddressFieldGroup>`](lib/AddressFieldGroup) | [doc](lib/AddressFieldGroup/readme.md) | control, prefab
[`<AppIcon>`](lib/AppIcon) | [doc](lib/AppIcon/readme.md) | design
[`<AutoSuggest>`](lib/AutoSuggest) | [doc](lib/AutoSuggest/readme.md) | control
[`<Avatar>`](lib/Avatar) | [doc](lib/Avatar/readme.md) | data-display
[`<Badge>`](lib/Badge) | [doc](lib/Badge/readme.md) | data-display, design
[`<Button>`](lib/Button) | [doc](lib/Button/readme/general.md) | control
[`<Callout>`](lib/Callout) | [doc](lib/Callout/readme.md) | user-feedback
[`<Checkbox>`](lib/Checkbox) | | control
[`<ConfirmationModal>`](lib/ConfirmationModal) | [doc](lib/ConfirmationModal/readme.md) | control, prefab
[`<Datepicker>`](lib/Datepicker) | [doc](lib/Datepicker/readme.md) | control
[`<Dropdown>`](lib/Dropdown) | [doc](lib/Dropdown/readme.md) | control
[`<DropdownMenu>`](lib/DropdownMenu) | | control
[`<EditableList>`](lib/EditableList) | [doc](lib/EditableList/readme.md) | control, prefab
[`<EmptyMessage>`](lib/EmptyMessage) | [doc](lib/EmptyMessage/readme.md) | structure
[`<EntrySelector>`](lib/EntrySelector) | | control
[`<ErrorBoundary>`](lib/ErrorBoundary) | | user-feedback
[`<FilterControlGroup>`](lib/FilterControlGroup) | | control
[`<FilterGroups>`](lib/FilterGroups) | [doc](lib/FilterGroups/readme.md) | control
[`<FilterPane>`](lib/FilterPane) | [doc](lib/FilterPane/readme.md) | structure
[`<FilterPaneSearch>`](lib/FilterPaneSearch) | [doc](lib/FilterPaneSearch/readme.md) | obsolete
[`<FocusLink>`](lib/FocusLink) | [doc](lib/FocusLink/readme.md) | accessibility
[`<Headline>`](lib/Headline) | [doc](lib/Headline/readme.md) | structure
[`<HotKeys>`](lib/HotKeys) | [doc](lib/HotKeys/readme.md) | utility
[`<Icon>`](lib/Icon) | [doc](lib/Icon/readme.md) | design
[`<IconButton>`](lib/IconButton) | [doc](lib/IconButton/readme.md) | control
[`<IfInterface>`](lib/IfInterface) | [doc](lib/IfInterface/readme.md) | utility
[`<IfPermission>`](lib/IfPermission) | [doc](lib/IfPermission/readme.md) | utility
[`<InfoPopover>`](lib/InfoPopover) | [doc](lib/InfoPopover/readme.md) | control, prefab
[`<KeyValue>`](lib/KeyValue) | [doc](lib/KeyValue/readme.md) | data-display
[`<Layer>`](lib/Layer) | [doc](lib/Layer/readme.md) | structure
[`<Layout>`](lib/Layout) | | structure
[`<LayoutBox>`](lib/LayoutBox) | | structure
[`<LayoutGrid>`](lib/LayoutGrid) | [doc](lib/LayoutGrid/readme.md) | structure
[`<LayoutHeader>`](lib/LayoutHeader) | [doc](lib/LayoutHeader/readme.md) | structure
[`<List>`](lib/List) | [doc](lib/List/readme.md) | data-display
[`<MenuItem>`](lib/MenuItem) | [doc](lib/MenuItem/readme.md) | control
[`<MetaSection>`](lib/MetaSection) | [doc](lib/MetaSection/readme.md) | data-display
[`<Modal>`](lib/Modal) | [doc](lib/Modal/readme.md) | container
[`<ModalFooter>`](lib/ModalFooter) | [doc](lib/ModalFooter/readme.md) | container
[`<MultiColumnList>`](lib/MultiColumnList) | [doc](lib/MultiColumnList/readme.md) | data-display
[`<MultiSelection>`](lib/MultiSelection) | [doc](lib/MultiSelection/readme.md) | control
[`<NavList>`](lib/NavList) | [doc](lib/NavList/readme.md) | control
[`<NavListItem>`](lib/NavListItem) | | control
[`<NavListSection>`](lib/NavListSection) | | control
[`<Pane>`](lib/Pane) | [doc](lib/Pane/readme.md) | structure
[`<PaneHeader>`](lib/PaneHeader) | | structure
[`<PaneMenu>`](lib/PaneMenu) | | control
[`<Paneset>`](lib/Paneset) | [doc](lib/Paneset/readme.md) | structure
[`<PaneSubheader>`](lib/PaneSubheader) | [doc](lib/PaneSubheader/readme.md) | structure
[`<Pluggable>`](lib/Pluggable) | | utility
[`<Popover>`](lib/Popover) | [doc](lib/Popover/readme.md) | control
[`<RadioButton>`](lib/RadioButton) | | control
[`<RadioButtonGroup>`](lib/RadioButtonGroup) | [doc](lib/RadioButtonGroup/readme.md) | control
[`<ReduxFormField>`](lib/ReduxFormField) | [doc](lib/ReduxFormField/readme.md) | control
[`<RepeatableField>`](lib/RepeatableField) | [doc](lib/RepeatableField/readme.md) | control, prefab
[`<SearchField>`](lib/SearchField) | [doc](lib/SearchField/readme.md) | control, prefab
[`<SegmentedControl>`](lib/SegmentedControl) | [doc](lib/SegmentedControl/readme.md) | control
[`<Select>`](lib/Select) | [doc](lib/Select/readme.md) | control
[`<Selection>`](lib/Selection) | [doc](lib/Selection/readme.md) | control
[`<Settings>`](lib/Settings) | [doc](lib/Settings/readme.md) | prefab
[`<SRStatus>`](lib/SRStatus) | [doc](lib/SRStatus/readme.md) | accessibility, user-feedback
[`<TabButton>`](lib/TabButton) | | control
[`<TextArea>`](lib/TextArea) | | control
[`<TextField>`](lib/TextField) | | control
[`<Timepicker>`](lib/Timepicker) | [doc](lib/Timepicker/readme.md) | control

There are also various [utility _functions_](util) (as opposed to React components), which are [documented separately](util/README.md).

## Patterns
Useful recipes for UI patterns appearing in FOLIO modules.

* [Show/Hide Columns in MCL](docs/patterns/ColumnSelector.md) -- Give users the ability to select only the data they need to see.
* [Accessible Routing](docs/patterns/AccessibleRouting.md) -- Detail the approaches to implementing accessible focus management.

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

See our [testing documentation](docs/Testing.md) for more information
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

* [Guide to UI Module Layout Components](docs/UIModuleLayout.md)
* [CSS for stripes-components development](docs/CSSinStripes.md)
* [Change-log](CHANGELOG.md)

See project [STCOM](https://issues.folio.org/browse/STCOM) (STripes COMponents)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker/).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
