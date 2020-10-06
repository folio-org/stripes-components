# MultiColumnList

Renders an array of data objects as a table where each object is a row and each property of the objects is a column. Capable of virtualizing rows in large collections of data.

## Basic Usage

```js
const catalogResults = [
    {title:'Microbiology Today', author:'James Edward'},
    {title:'Orange Book', author:'Philip Ramos'},
]

<MultiColumnList contentData={catalogResults} />
```

You can also specify a formatter object to control exactly how the data is rendered: see below.

### Infinite scroll
For large lists of data the boolean prop `virtualize` can be turned on to efficiently display only the table rows that are visible to the user within the scrollable body of the list. The `virtualize` prop should be used in conjunction with the `height`, `maxHeight` or `autosize` prop - virtualization will not work otherwise.

### Height and `autosize` props
For efficiency, virtualization of list items requires a static `height` value (not percentage-based). If you're unsure how large the list's containing element will be, you can set the `autosize` prop to true - this will make the grid dynamically fill the space that it has, automatically using the resulting static width and height. This is ideal for the content of results panes.

### Horizontal scroll
The list will scroll its content horizontally if there isn't enough horizontal room to display all of the columns.

### Column mapping
MultiColumnList supports column header mapping via. the `columnMapping`-prop. This allows for mapping column headers to alternative strings. This is very useful for translating column headers.

Note: The recommended text casing for column headers is _sentence casing_. Read more about language rules [here](https://ux.folio.org/docs/guidelines/language-rules/).

Here's an example from the Users-module:
```js
  <MultiColumnList
    contentData={...}
    visibleColumns={['actionDate', 'action', 'dueDate', 'itemStatus', 'source']}
    columnMapping={{
      action: <FormattedMessage id="ui-users.loans.columns.action" />,
      actionDate: <FormattedMessage id="ui-users.loans.columns.actionDate" />,
      dueDate: <FormattedMessage id="ui-users.loans.columns.dueDate" />,
      itemStatus: <FormattedMessage id="ui-users.loans.columns.itemStatus" />,
      source: <FormattedMessage id="ui-users.loans.columns.source" />,
    }}
  />
```
## Column Widths
MultiColumnList measures DOM elements at render-time to calculate a single width for the entire column. At a minimum, this will be the width of the column's header. Render-time measurement is not always the preferred way to go, so MultiColumnList has the `columnWidths` prop for pre-determined widths to be applied. This will also avoid calculation of widths for pre-determined columns at render-time.
For columns where the column content width may vary, space conservation is important. For this, the width 'hint' API can be used.

```js
const columnWidths = {
  name: '200px',
  jobTitle: { min: 30, max: 300 },
  startDate: '300px'
}

<MultiColumnList ... columnWidths={columnWidths} />
```

**Advice #1**: Use a pre-determined width if there's a large amount of difference between a column's contents from one row to another. For instance, "title" items could contain a single word, or it could contain 10 words. Calculation will prefer a width that's closer to the longest among the sampled cells, so setting a width is the best way to keep the widths modest.

**Advice #2**: Prefer pixel `px` values to `percent` values. You can apply any CSS unit you'd like, in the `columnWidths` prop, but percents `%` are less practical and often result columns being overly squeezed with content growing very tall in comparison to other columns of the row.

## Storybook examples
Check out our [hosted storybook](https://ux.folio.org/storybook/) for examples of usage. Source code for these stories is all available in  [the MultiColumnList stories directory](https://github.com/folio-org/stripes-components/tree/master/lib/MultiColumnList/stories).

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
`autosize` | bool | if true, list will size itself to fit its containing element. Use this to have a list occupy the full width and height of a `<Pane>`s content area. | false |
`columnMapping` | object | Maps rendered column labels to the data fields for the onHeaderClick prop. | `{}` |
`columnWidths` | object | Set custom column widths, e.g. {email: '150px'}. Component will automatically measure any columns that are unspecified. An object can be provided with `min` and `max` keys to set up a range - MCL will pick as close to the `min` as it can and none over the `max`.| |
`contentData` | array of object | the list of objects to be displayed. | | required
`dataEndReached` | bool | Used in conjuction with `pagingType="click"`, `dataEndReached` can be used if a suitable `totalCount` prop cannot be obtained. Setting this to `true` will render the "end-of-list" marker rather than the load button. | `false` |
`formatter`  | object mapping names to functions | see separate section | |
`getCellClass` | func | Used to update or completely overwrite the visual styles for each column. The function passed to this prop will receive the current CSS class, row data and the column name as the parameters and the returned value will overwrite the default class – e.g. `(defaultClass, rowData, header) => ${defaultClass} ${myCustomClass}` | `undefined` |
`getHeaderCellClass` | func | Used to update the visual styles for each column header. The function passed to this prop will receive the column name as the  parameter and the returned value will extend the default class – e.g. `header =>  ${myCustomClass}` | `undefined` |
`hasMargin` | bool | Applies horizontal margin on rows and header. This is primarily used to achieve the correct spacing within result panes. | |
`headerMetadata` | object | Object with data to include with the | |
`headerRowClass` | string | Applies a css class to the header row of the list. | |
`height` | string or number | the height of the table. **Necessary if `virtualize` is active you aren't using `autosize` already.** |  |
`interactive` | bool | Applies a "pointer" cursor when the mouse hovers over a row | `true` |
`isEmptyMessage` | string, object, node, arrayOf(node) | Message to display when the supplied contentData array is empty. | <FormattedMessage id="stripes-components.tableEmpty" /> |
`isSelected` | func({`item`}) | Should return `true` or `false` on whether or not to apply the `selectedClass` to the row. Useful for multiple selections. Preferred over `selectedRow` | |
`loading` | bool | If true, will display an animated loading icon. | |
`maxHeight` | number | the maximum height that the list should grow to before scrolling its list body in pixels. | |
`nonInteractiveHeaders` | array of strings | Pass an array of column names to make their column headers non-interactive. This is only relevant if you have supplied an `onHeaderClick`-callback and you only want some of the header columns to be interactable. | [] |
`onHeaderClick` | func[event, headerMetadata] | callback function invoked when one of the cells in the header is clicked (typically to choose a sort-order). By default, headerMetadata includes the column's data name as well as its alias, in case a object is supplied to the columnMapping prop. | |
`onNeedMoreData` | func(`askAmount`, `index`) | Callback for fetching more data. If this prop is provided and a `totalCount` prop is provided, but un-reached by the count of loaded data items, `askAmount` will ask for the remainder of items or the `pageAmount` prop, whichever is less. This can be used to fulfill `limit` query parameters. `rowIndex` can be used to fulfill an `offset` query parameter. | |
`onRowClick` | function(`event`, `item`) | callback function invoked when one of the lines in the table is clicked (typically to select a record for more detailed display). | |
`onScroll` | func | Callback for scrolling of list body. | `noop` |
`pageAmount` | number | The base amount of data to pass as the `askAmount` parameter for the `onNeedMoreData` prop | `30` |
`pagingType` | string | Controls the interaction type when loading more data in the MCL. `"scroll"` is used for infinite scroll/loading scenarios, `"click"` renders a paging button below the results if the loaded count is less than the `totalCount` prop. | `"scroll"` |
`rowFormatter`  | func | function of shape `<name>({rowIndex, rowClass, rowData, cells, rowProps}){return <reactElement>}` that can be used to supply custom row layout. Forking [defaultRowFormatter](defaultRowFormatter.js) is a good place to start if you need to use this. | `defaultRowFormatter` |
`rowMetadata` | object | arbitrary data that is passed as a metadata object to the `onRowClick` handler - useful for passing in data that may exist outside of the realm of the rendered MCL. | |
`rowUpdater` | func(`rowData`, `rowIndex`) | This function should return a shallow data structure (flattened object) or primitive (string, number) that will indicate that exterior data for a row has changed. It will receive two parameters of the `rowData` and the `rowIndex` that can be used to base return values. This result is fed directly to the data rows via props, keeping them pure. You should rarely have to use this prop, as most changes will be relayed directly in the `contentData` array itself. | `noop` |
`selectedClass` | string | override class for the default style applied to selected rows. | built-in |
`selectedRow` | object | **legacy API** Applies 'selected' class to the table row matching the property in the object, e.g. {id: '1224'}. | |
`sortedClass` | string | override class for the default style applied to headers of sorted columns. | built-in |
`sortedColumn` | string | Used to apply styling to the appropriate column. | |
`sortOrder` | string | 'ascending' or 'descending' direction. | |
`striped` | bool | Adds striped style to rows | `true` |
`virtualize` | bool | Employs virtualization for performant rendering of large sets of data. | |
`visibleColumns` | array of strings | an ordered list of column names, indicating which fields from each object should be included in the table. (When omitted, the keys from the first record are used.) | |

## Usability: Clickable Rows vs clickable cells
Using both types of interaction is not good for users or developers, so it's best to simply use one or the other. For clickable cell content, place clickable elements within `formatter`s. Clickable rows are easily created by using the `onRowClick` prop.

## Formatter

Formatters allow for specific control of how data is rendered. Given the following data:

```js
catalogResults = [
        { title: 'Biology Today',
          id: '199930490002',
          author: {
            firstName: 'James',
            lastName: 'Whitcomb',
          },
        },
        { title: 'Financial Matters',
          id: '199930490034',
          author: {
            firstName: 'Philip',
            lastName: 'Marston',
          },
        },
        { title: 'Modern Microbiotics',
          id: '199930490064',
          author: {
            firstName: 'Eric',
            lastName: 'Martin',
          },
        },
      ];
```

A formatter object can be used to render the author.firstName and author.lastName properties concatenated inside the corresponding table cell. Each property of the formatter object contains a function that returns a string or JSX element to be rendered:

```js
const resultsFormatter = {
      author: item => `${item.author.firstName} ${item.author.lastName}`,
    };

<MultiColumnList
    contentData={catalogResults}
    formatter={resultsFormatter}
    visibleColumns={['title', 'author']}
/>
```

#### Side-effects in formatters
Efficient performance of MCL depends on rows being "Purely" rendered - no exterior data used aside from what is directly supplied to the formatters themselves in the `item` argument. Doing so is discouraged and problematic. If an instance is using "impure" techniques, rows may not update as you would expect them to. Two suggestions for handling this:
1. Actually include the exterior data into your `contentData` prop if possible.
2. Use the `rowUpdater` prop to have MCL rows detect/render the changes.

```
  // for 'active' rows, pass in a data item for another list at the corresponding index... otherwise, return null.
  rowUpdater = (rowData, rowIndex) => {
    return rowData.active ? otherData[rowIndex] : null;
  }
```
### Formatting Rows
It's possible to modify the rendered mark-up of rows using the `rowFormatter` prop. If one of these is needed, the best place to start is a fork of [defaultRowFormatter](defaultRowFormatter.js).
Here's an example that wraps rows in anchor tags instead of the default div:
```js
// utility function to fill anchor's href attribute...
getRowURL(rowData){
  return `url/with/${rowData.info}`;
}

// custom row formatter function
anchoredRowFormatter(
    { rowIndex,
      rowClass,
      rowData,
      cells,
      rowProps,
      labelStrings,
    }
  ){
    return (
      <a
        href={this.getRowURL(rowData)} key={`row-${rowIndex}`}
        aria-label={labelStrings.join('...')}
        role="listitem"
        className={rowClass}
        {...rowProps}
      >
        {cells}
      </a>
    );
  }

// and the JSX...

<MultiColumnList
  // ...other props
  rowFormatter={this.anchoredRowFormatter}
/>
```
