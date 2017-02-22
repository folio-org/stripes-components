# FilterGroups

<!-- ../../../okapi/doc/md2toc -l 2 readme.md -->
* [Basic Usage](#basic-usage)
* [Overview](#overview)
    * [Filter configuration](#filter-configuration)
    * [Component state](#component-state)
    * [Representation in the user-interface URL](#representation-in-the-user-interface-url)
* [The `initialFilterState` function](#the-initialfilterstate-function)
* [The `<FilterGroups>` component](#the-filtergroups-component)
    * [Properties](#properties)
* [The `filters2cql` function](#the-filters2cql-function)

This component renders a set of filter-groups, each of which pertains to a searchable field and contains a set of filters that indicate values required for that field.


## Basic Usage

```js 
const filterConfig = [
  {
    label: 'Item Types',
    name: 'item',
    cql: 'materialType',
    values: ['Books', 'DVDs', 'Microfilm'],
  }, {
    label: 'Location',
    name: 'location',
    cql: 'location.name',
    values: [{ name: 'Main Library', cql: 'main' }, 'Annex Library'],
  },
];

this.state = {
  filters: initialFilterState(filterConfig, props.location.query.filters),
};

<FilterGroups config={filterConfig} filters={this.state.filters} />

const filterCql = filters2cql(filterConfig, filters);
```


## Overview

This library provides several utilities for initialising, rendering
and manipulating sets of filters, and deriving from them a query
expressed in CQL. The general approach is that a React component
declaratively specifies a set of filter groups, which is then uses in
several different contexts to drive different but related pieces of
code.

In order to make it easy to use without needing to make a lot of
decisions, this library is opinionated about state representation,
both within the React component that uses it and in the user-interface
URL.

XXX Some thought is still required regarding whether it could usefully
be more or less opinionated than it presently is.


### Filter configuration

The filter configuration is an array containing an ordered list of
filter groups. Each group is represented by an object with four keys:

* `label` -- The human-readable label that is used when presenting the
  group on a page.
* `name` -- The name used internally for the filter group, which may
  be short or opaque in meaning.
* `cql` -- The name of the CQL index that corresponds to the filter
  group, and which will be used in queries to find records that
  satisfy particular settings of the filters in the group. In general,
  this will be the name of a field, or maybe subfield, in the schema
  for the kind of records under consideration.
* `values` -- A list of the possible values that may be selected for
  the filter.

Each of the values is typically represented by a simple string, which
is used both to display on the page and as the value to use in
queries. However, each value may optionally instead be an object
containing two keys:

* `name` -- the name used to display the filter on the page.
* `cql` -- the value used when generating CQL queries.

In the example above, there are two filter groups, "Item Types" and
"Location". All the values of the former are simple strings; one of
the values of the latter is of the more complex form, using "Main
Library" as the displayed value and just 'main' as the corresponding
value to use in searches.

Each filter value has a "full name", made up of the group name, a
period and the filter name itself. For example, in the configuration
above, the full names include `item.Books` and `location.Annex
Library`.

### Component state

The FilterGroup utilities use a single member of the component's
state, `filters`. Its value represents which filters are presently
selected. It is represented as an object whose keys are the full names of
filters, and whose values are booleans. (Since a value of `false` has
the same meaning as the key not being present, usually all values are
`true`.) For example:

	filters: {
	  'item.DVDs': true,
	  'item.Microfilm': true,
	  'location.Main Library': true
	}

### Representation in the user-interface URL

The state of the filters is represented in the user-interface's URL as
a single query parameter, `filters`, whose value is a comma-separated
list of the full names of all selected filters. For example:

     
	http://example.com/users?filters=item.DVDs,item.Microfilm,location.Main+Library


## The `initialFilterState` function

This function takes as its parameters the figure configuration
structure and a comma-separated string of filters' full names, such as
`'item.DVDs,item.Microfilm,location.Main Library'`. It returns an
object whose keys are the full names and whose values are all the
boolean `true`.

It therefore maps between the URL representation of a set of filters
and the React component-state of the same. It is used to set the
initial state of a React component based on the value of the query
parameter in the URL:

	class SomeComponent extends React.Component {
	  constructor(props) {
	    super(props);

	    const query = props.location.query || {};
	    this.state = {
	      filters: initialFilterState(filterConfig, query.filters),
	      // other members of component state
	    };


## The `<FilterGroups>` component

This component renders the full set of filter groups, with headings.

### Properties

The following properties are supported:

* `config` -- the configuration structure described above, which
  specifies which groups and filters to render.
* `filters` -- an objects whose keys are the full names of filters
  that are selected (i.e. the `filters` part of the component state).
* `onChangeFilter` -- a function that is invoked when one of the
  filters is clicked.

The change-filter handler function is the most awkward part of this
API. It must update the component state to represent the change in the
clicked filter's setting -- which is easy; but it must also transition
to a new URL that incorporates the modified filter state, and there is
no general way to do that without knowing about the component's other
state (e.g. query, sort-order).

So the function will always look _something_ like this:

	onChangeFilter(e) {
	  const filters = Object.assign({}, this.state.filters);
	  filters[e.target.name] = e.target.checked;
	  this.setState({ filters });
	  this.transitionToUrlReflectingFilters(filters);
	}

But the implementation of `transitionToUrlReflectingFilters` will vary
between applications.


## The `filters2cql` function

This function takes as its parameters the figure configuration
structure and a comma-separated string of filters' full names, such as
`'item.DVDs,item.Microfilm,location.Main Library'` -- exactly the same
parameters as the `initialFilterState` function.

It returns a string containing a CQL query corresponding to the
specified set of filters, such as
`materialType=("DVDs" or "Microfilm") and location.name="main"`. This
can be combined with other CQL fragments representing the component's
current query and sort-order to yield a full CQL query for the
component's entire state -- typically within a [path
function](https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#functional-paths)
in a [Stripes Connect
manifest](https://github.com/folio-org/stripes-connect/blob/master/doc/api.md#the-connection-manifest).

The interpretation of the filters is as follows:

* Filter groups for which no item is selected play no role at all.
* The constraints of _all_ filter groups for which at least one item is
  selected must be satisfied.
* Each filter group is satisfied by records that have _any_ of the
  values specified in the filter.

In short, records are found if they match _any_ of the values for _all_ of
the non-empty groups.


