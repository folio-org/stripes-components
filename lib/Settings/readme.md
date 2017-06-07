# Settings

Displays the settings page for a Stripes module, given a list of the sub-pages to link and route to.

## Usage

```
import React from 'react';
import Settings from './Settings';

import PermissionSets from './PermissionSets';
import PatronGroupsSettings from './PatronGroupsSettings';

const pages = [
  { route: 'perms', label: 'Permission sets', component: PermissionSets, perm: 'perms.permissions.get' },
  { route: 'groups', label: 'Patron groups', component: PatronGroupsSettings },
];

export default props => <Settings {...props} pages={pages} />;
```

## Properties

The following properties are supported:

* `pages`: the list of sub-pages to be linked from the settings page. Each member of the list is an object with the following members:
  * `route`: the route, relative to that of the settings page, on which the sub-page should be found.
  * `label`: the human-readable label that, when clicked on, links to the specified route.
  * `component`: the component that is rendered at the specified route.
  * `perm`: if specified, the name of a permission which the current user must have in order to access the page; if the user lacks the permission, then the link is not provided. (If omitted, then no permission check is performed for the sub-page.)
	  
