# Discussion point: parameterizing `makeQueryFunction`

<!-- md2toc -l 2 parameterizing-makeQueryFunction.md -->
* [Introduction](#introduction)
    * [Motivation](#motivation)
    * [Principles](#principles)
* [Proposal](#proposal)
* [Examples](#examples)
    * [Code](#code)
    * [URLs](#urls)
* [Implications](#implications)


## Introduction

### Motivation

UNAM (the National Autonomous University of Mexico) are adding functionality to the Users app to allow an administrator, once a user has been selected, to search within that user's fees and fines. To achieve this, they want to use the `<SearchAndSort>` high-level utility component and the associated function `makeQueryFunction`. However, this does not work because the URL query parameters that it uses -- `query`, `filters`, `sort` -- have already been set by the User app's own use of `<SearchAndSort>`.

How can the UNAM team provide searching at this nested level within an app?


### Principles

It is widely agreed that utilities like `<SearchAndSort>` and `makeQueryFunction` should be as dumb as possible, not making assumptions about what parts of the URL query namespace they can use. Instead, callers of `makeQueryFunction` should specify at the time they call it which URL parameters it should use. (The same is true of `<SearchAndSort>`, but for simplicity this document will concentrate on `makeQueryFunction`.)


## Proposal

The simplest way to parameterize `makeQueryFunction` is to pass in a set of parameter names to use. As a short-cut, it should be possible simply to pass in a prefix, used to namespace the standard parameter names. Finally, when no parameter names or prefix are provided, the present behaviour should be retained, and the standard set of parameter names used. This will provide both backwards-compatibility in the API and a convenient shorthand for the common case of using this facility at the top-level of a UI module.

I propose a single additional argument, `params`, which may be either a string which is used as a prefix, or an object whose keys are the standard parameters and whose corresponding values are the parameters to use in their roles.


## Examples

### Code

The Users app presently uses `makeQueryFunction` at the top level to manage searching and sorting users. The function that it returns is installed as `manifest.records.GET.params.query`, and the invocation is as follows:

```
	makeQueryFunction(
	  'cql.allRecords=1',
	  '(username="%{query.query}*" or personal.firstName="%{query.query}*" or personal.lastName="%{query.query}*" or personal.email="%{query.query}*" or barcode="%{query.query}*" or id="%{query.query}*" or externalSystemId="%{query.query}*")',
	  {
	    'Active': 'active',
	    'Name': 'personal.lastName personal.firstName',
	    'Patron group': 'patronGroup.group',
	    'Username': 'username',
	    'Barcode': 'barcode',
	    'Email': 'personal.email',
	  },
	  filterConfig,
	  2,
	)
```
The parameters are as follows:
* Query to use for finding all records when no query-string is specified in the UI.
* Query string template for when the query has been specified in the UI.
* Sort-map, from column-header names to CQL sort-field names.
* Filter configuration (see [**FilterGroups: Filter configuration**](../lib/FilterGroups/readme.md#filter-configuration)).
* A specification that query-generation should fail when both the UI query and the filters are unspecified.

To this, a sixth argument may be added, which might take any of the following values:

* `null`: use the standard parameter as is presently the case.
* `'users': prefix the names of the standard parameters with `users.`, so that they become `users.query`, `users.filters` and `users.sort`.
* `{ query: 'users.query', filters: 'users.filters', sort: 'users.sort' }`: equivalent to the prefix, but specified explicitly.
* `{ query: 'uq', filters: 'uf', sort: 'us' }`: use the more terser parameter names `uq`, `uf` and `us` in place of the standard parameters.

Assuming that no such argument was provided in the Users app's top-level invocation of `makeQueryFunction`, the nested component that provides searching and sorting of fees and fines might invoke along these lines for its own manifest:

```
	makeQueryFunction(
	  'cql.allRecords=1',
	  'feeFineType="%{query.query}*"',
	  {
	    'Amount': 'defaultAmount',
	    'VAT%': 'taxVat',
	  },
	  filterConfig,
	  0,
	  'fees'
	)
```

### URLs

The setup outlined above would cause the parameter `fees.query`, `fees.filters` and `fees.sort` to be used for generating the relevant queries. These could co-exist in the URL along with the corresponding parameters as used by the top-level application, yielding URLs such as

	http://demo.folio.org/users/view/123/feesfines?query=smith&filters=active.Active&fees.query=overdue

It would be a matter for application designers to decide when to retain all of a URL's query parameters, and when to discard some: for example, in some situations it may be desirable when generating the URL for a fees-and-fines page to discard the information about the user search. In this case, the URL would simply be:

	http://demo.folio.org/users/view/123/feesfines?fees.query=overdue

(The information about which user the listed fees and fines are for is held in the URL path, not a parameter: it is the user-ID `123`.)


## Implications

A similar configurability facility would also need to be added to the `<SearchAndSort>` component, which sets the URL query parameters that `makeQueryFunction` reads. The principles are the same as outlined here.

This issue is not limited to `<SearchAndSort>` and `makeQueryFunction`, but also bleeds over into `<FilterGroups>` and any other components and utility functions in stripes-components that have unfettered access to the URL.


