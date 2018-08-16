# MultiColumnList

Renders an array of data objects as a table where each object is a row and each property of the objects is a column. Properties can modify this basic functionality.

## Basic Usage

```js
const catalogResults = [
    {title:'Microbiology Today', author:'James Edward'},
    {title:'Orange Book', author:'Philip Ramos'},
]

<MultiColumnList contentData={catalogResults} />
```

You can also specify a formatter object to control exactly how the data is rendered: see below.

### Infinite Scroll
For large lists of data the boolean prop `virtualize` can be turned on to efficiently display only the table rows that are visible to the user within the scrollable body of the list.

### height and `autosize` props
For efficiency, virtualization of list items requires a static `height` value (not percentage-based). If you're unsure how large the list's containing element will be, you can set the `autosize` prop to true - this will make the grid dynamically fill the space that it has, automatically using the resulting static width and height. This is ideal for the content of results panes.

### keyboard controls
The containing div of the list is focusable. By default, the list's rows are tab-able. If tabbing among the list items, the <kbd> `` ` `` </kbd> (above <kbd>Tab</kbd>) will get you back out, and <kbd>shift</kbd>+<kbd> `` ` `` </kbd> will skip to the next focusable element **after** the list.

### horizontal scroll
At the time of this writing, the list will scroll its content horizontally if there isn't enough horizontal room to display all of the columns. This is likely to change in the near future.

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
`contentData` | array of object | the list of objects to be displayed. | | required
`visibleColumns` | array of strings | an ordered list of column names, indicating which fields from each object should be included in the table. (When omitted, the keys from the first record are used.) | |
`autosize` | bool | if true, list will size itself to fit its containing element. Use this to have a list occupy the full width and height of a `<Pane>`s content area. | false |
`height` | string or number | the height of the table. **Necessary if `virtualize` is active you aren't using `autosize` already.** |  |
`maxHeight` | number | the maximum height that the list should grow to before scrolling its list body in pixels. | |
`onRowClick` | function | callback function invoked when one of the lines in the table is clicked (typically to select a record for more detailed display). | |
`rowMetadata` | object | arbitrary data that is passed as a metadata object to the `onRowClick` handler - useful for passing in data that may exist outside of the realm of the rendered MCL. | |
`headerMetadata` | object | Object with data to include with the | |
`formatter`  | object mapping names to functions | see separate section | |
`selectedRow` | object | Applies 'selected' class to the table row matching the property in the object, e.g. {id: '1224'}. | |
`sortedColumn` | string | Used to apply styling to the appropriate column. | |
`sortOrder` | string | 'ascending' or 'descending' direction. | |
`onHeaderClick` | func[event, headerMetadata] | callback function invoked when one of the cells in the header is clicked (typically to choose a sort-order). By default, headerMetadata includes the column's data name as well as its alias, in case a object is supplied to the columnMapping prop. | |
`columnMapping` | object | Maps rendered column labels to the data fields for the onHeaderClick prop. | `{}` |
`columnWidths` | object | Set custom column widths, e.g. {email: '40%'}. Component will automatically measure any columns that are unspecified. | |
`selectedClass` | string | override class for the default style applied to selected rows. | built-in |
`sortedClass` | string | override class for the default style applied to headers of sorted columns. | built-in |
`isEmptyMessage` | string | Message to display when the supplied contentData array is empty. | 'The list contains no items' |
`onNeedMoreData` | func | Callback for fetching more data | |
`virtualize` | bool | Employs virtualization for performant rendering of large sets of data. | |
`loading` | bool | If true, will display an animated loading icon. | |
`onScroll` | func | Callback for scrolling of list body. | `() => {}` |
`striped` | bool | Adds striped style to rows | `true` |
`rowFormatter`  | func | function of shape `<name>({rowIndex, rowClass, rowData, cells, rowProps}){return <reactElement>}` that can be used to supply custom row layout. Forking [defaultRowFormatter](defaultRowFormatter.js) is a good place to start if you need to use this. | `defaultRowFormatter` |
`interactive` | bool | Applies a "pointer" cursor when the mouse hovers over a row | `true` |
`headerRowClass` | string | Applies a css class to the header row of the list. | |
`csvShowButton` | bool | Displays the "Export to CSV" button
`csvExcludeKeys` | array of strings | List of columns in the data that should be excluded in the CSV

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
