# stripes-components

Copyright (C) 2016-2018 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

A library of React components and utility functions for Stripes.

* [Guide to UI Module Layout Components](docs/UIModuleLayout.md)
* [CSS for stripes-components development](docs/CSSinStripes.md)
* [Change-log](CHANGELOG.md)

## Component Categories

These are general descriptive categories that indicate the type of use cases that components serve. A component can have multiple categories associated with it.

Category name | description
--- | ---
**structure** | These are components that aid in the general structure/layout of your app's UI. They include generic containers and components that render structurally important html tags (`<Headline>`, for instance.)
**control** | Components with the control category are form elements and other interactive widgets including `<TextField>`, `<Button>` and `<Dropdown>` - additionally, this category includes componets that aid the functionality of other control components, such as the way `<DropdownMenu>` is used with `<Dropdown>`
**data-display** | Data display components are used for dispay of dynamic content. These include `<List>` and `<MultiColumnList>`
**design** | These components render `<Icon>`s and other prominent visual landmarks.
**user-feedback** | These components are geared for making the user aware of happenings in the system. They include `<Callout>` and `<SRStatus>`.
**accessibility** | Components with this category play an important role in developing accessible modules.
**utility** | These components aid in interaction with the FOLIO system.
**prefab** | These components are re-useable pre-constructed components that make re-use of other shared components. Useful constructions such as `<AddressFieldGroup>` and `<EditableList>` fall into this category.
**obsolete** | Component has been replaced by better solution and is intended for removal in future releases.

## Links to documentation of specific components and utilities

The following components are available in the [lib](lib) directory.
There are also various [Utility functions](util/README.md).

Component | doc | categories
--- | --- | ---
[`<Accordion>`](lib/Accordion) | [doc](lib/Accordion/readme.md) | structure
[`<AppIcon>`](lib/AppIcon) | [doc](lib/AppIcon/readme.md) | design
[`<AuthorityList>`](lib/AuthorityList) | | control prefab
[`<Badge>`](lib/Badge) | [doc](lib/Badge/readme.md) | data-display, design
[`<Button>`](lib/Button) | [doc](lib/Button/readme/general.md) | control
[`<Callout>`](lib/Callout) | [doc](lib/Callout/readme.md) | user-feedback
[`<Checkbox>`](lib/Checkbox) | | control
[`<Datepicker>`](lib/Datepicker) | [doc](lib/Datepicker/readme.md) | control
[`<Dropdown>`](lib/Dropdown) | [doc](lib/Dropdown/readme.md) | control
[`<DropdownMenu>`](lib/DropdownMenu) | | control
[`<EntrySelector>`](lib/EntrySelector) | | control
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
[`<KeyValue>`](lib/KeyValue) | [doc](lib/KeyValue/readme.md) | data-display
[`<Layer>`](lib/Layer) | [doc](lib/Layer/readme.md) | structure
[`<Layout>`](lib/Layout) | | structure
[`<LayoutBox>`](lib/LayoutBox) | | structure
[`<LayoutGrid>`](lib/LayoutGrid) | [doc](lib/LayoutGrid/readme.md) | structure
[`<LayoutHeader>`](lib/LayoutHeader) | [doc](lib/LayoutHeader/readme.md) | structure
[`<List>`](lib/List) | [doc](lib/List/readme.md) | data display
[`<MenuItem>`](lib/MenuItem) | [doc](lib/MenuItem/readme.md) | control
[`<MetaSection>`](lib/MetaSection) | [doc](lib/MetaSection/readme.md) | data-display
[`<Modal>`](lib/Modal) | [doc](lib/Modal/readme.md) | container
[`<MultiColumnList>`](lib/MultiColumnList) | [doc](lib/MultiColumnList/readme.md) | data-display
[`<NavList>`](lib/NavList) | [doc](lib/NavList/readme.md) | control
[`<NavListSection>`](lib/NavListSection) | | control
[`<Pane>`](lib/Pane) | [doc](lib/Pane/readme.md) | structure
[`<PaneHeader>`](lib/PaneHeader) | | structure
[`<PaneMenu>`](lib/PaneMenu) | | control
[`<Paneset>`](lib/Paneset) | [doc](lib/Paneset/readme.md) | structure
[`<PaneSubheader>`](lib/PaneSubheader) | [doc](lib/PaneSubheader/readme.md) | structure
[`<Pluggable>`](lib/Pluggable) | | utility
[`<RadioButton>`](lib/RadioButton) | | control
[`<RadioButtonGroup>`](lib/RadioButtonGroup) | [doc](lib/RadioButtonGroup/readme.md) | control
[`<SegmentedControl>`](lib/SegmentedControl) | [doc](lib/SegmentedControl/readme.md) | control
[`<Select>`](lib/Select) | [doc](lib/Select/readme.md) | control
[`<Settings>`](lib/Settings) | [doc](lib/Settings/readme.md) | prefab
[`<SRStatus>`](lib/SRStatus) | [doc](lib/SRStatus/readme.md) | accessibility, user-feedback
[`<AddressFieldGroup>`](lib/structures/AddressFieldGroup) | [doc](lib/structures/AddressFieldGroup/readme.md) | control, prefab
[`<ConfirmationModal>`](lib/structures/ConfirmationModal) | [doc](lib/structures/ConfirmationModal/readme.md) | control prefab
[`<EditableList>`](lib/structures/EditableList) | [doc](lib/structures/EditableList/readme.md) | control, prefab
[`<RepeatableField>`](lib/structures/RepeatableField) | [doc](lib/structures/RepeatableField/readme.md) | control, prefab
[`<SearchField>`](lib/structures/SearchField) | [doc](lib/structures/SearchField/readme.md) | control, prefab
[`<TabButton>`](lib/TabButton) | | control
[`<TextArea>`](lib/TextArea) | | control
[`<TextField>`](lib/TextField) | | control

## Additional information

See [stripes-core](https://github.com/folio-org/stripes-core).

See project [STRCOM](https://issues.folio.org/browse/STRCOM)
at the [FOLIO issue tracker](http://dev.folio.org/community/guide-issues).

Other FOLIO Developer documentation is at [dev.folio.org](http://dev.folio.org/)
