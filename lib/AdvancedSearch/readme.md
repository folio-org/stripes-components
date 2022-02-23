# AdvancedSearch
Provides advanced search functionality - user-friendly ability to construct a complex query with boolean conditions.

## Basic Usage
```js
  import { AdvancedSearch } from '@folio/stripes/components';

  // in component body
  const searchOptions = [{
    id: 'keyword',
    label: 'Keyword',
    value: 'keyword',
  }, {
    id: 'name',
    label: 'Name',
    value: 'name',
  }];

  const keywordOption = 'keyword';

  const firstRowInitialSearch = {};

  <AdvancedSearch
    open={isOpen}
    searchOptions={searchOptions}
    defaultSearchOptionValue={keywordOption}
    firstRowInitialSearch={firstRowInitialSearch}
    onSearch={handleSearch}
    onCancel={handleCancel}
  />
```

## Advanced Usage
In some cases users may want to do custom formatting of query string. This can be done with the use of `rowFormatter` or `queryBuilder`.
`rowFormatter` can be used to combine the boolean operator, searched term and search option. For example, if you'd like to change comparison operator from default `==` to `=`.
`queryBuilder` gives users complete control over query construction. `AdvancedSearch` will call this function with an array of object representing rows and users can use that to meet their requirements.
More about `rowFormatter` and `queryBuilder` in [Props](#props).

`AdvancedSearch` also accepts a function as children and will call it with object containing `resetRows` function - it will clear internal state. It may be used with "Reset all" buttons on search pages to also clear `AdvancedSearch` rows.

```js
  import { AdvancedSearch } from '@folio/stripes/components';

  // in component body

  const queryBuilder = (rows, rowFormatter) => {
    const formatRowCondition = (row) => {
      // use default row formatter, but wrap each search term with parentheses
      return `(${rowFormatter(row.searchOption, row.query, '==')})`;
    };

    return rows.reduce((formattedQuery, row, index) => {
      const rowCondition = formatRowCondition(row);

      const boolMap = {
        and: '&&',
        or: '||',
        not: '!',
      };

      return `${formattedQuery} ${boolMap[row.bool]} ${rowCondition}`;
    }, '');
  };

  <AdvancedSearch
    open={isOpen}
    searchOptions={searchOptions}
    defaultSearchOptionValue={keywordOption}
    firstRowInitialSearch={firstRowInitialSearch}
    queryBuilder={queryBuilder}
    rowFormatter={rowFormatter}
    onSearch={handleSearch}
    onCancel={handleCancel}
  >
    {({ resetRows}) => (
      <Button
        onClick={resetRows}
      >
        Reset all
      </Button>
    )}
  </AdvancedSearch>
```

In the example above, custom `rowFormatter` will wrap each search term with parentheses. And `queryBuilder` is written so that boolean conditions will be written as symbols (`&&`, `||`, `!`) instead of default text representation (`and`, `or`, `not`).

## Props
Name | Type | Description | Required
--- | --- | --- | ---
children | function | Pass any a function that will accept `{ resetRows }`. `resetRows` can be used to clear `AdvancedSearch` state. | false
open | boolean | Controls visibility of `AdvancedSearch` modal | false
searchOptions | array | Array of search options. Format: `[{ label, value, id }]` `id` is an optional property. `AdvancedSearch` will add `Query` as first option. | true
onSearch | func | Callback fired when search is performed. Called with two arguments: `query` - formatted query string and `rows` - array of non-empty rows with shape `{ bool, query, searchOption }` | true
onCancel | func | Callback fired when the user clicks the cancel button. | true
defaultSearchOptionValue | string | One of the options in `searchOptions` that will be selected by default in all rows | false
firstRowInitialSearch | object | Object with shape `{ query, option }` - will be used to populate first row with default values | false
rowFormatter | func | Function that will be used to combine boolean, query and search option of each row. Signature: `(searchOption, query, bool, comparator) => {...}`. Returned values will be used by `queryBuilder` to join them together. *Note:* no need to add `bool` to resulting string here - it will be added by `queryBuilder`. | false
queryBuilder | func | Function that will be used to construct the search query. Signature: `(rows, rowFormatter) => {...}`. `rows` - array of shapes `{ query, searchOption, query }`, `rowFormatter` - the prop. Returned value will be passed as the first argument to `onSearch`. | false
