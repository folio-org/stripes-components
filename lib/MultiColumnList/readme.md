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

## Properties

The following properties are supported:

* `contentData` (array of object): the list of objects to be displayed.
* `visibleColumns` (array of string): an ordered list of column names, indicating which fields from each object should be included in the table. (When omitted, the keys from the first record are used.)
* `rowMetadata` (array of string): a list of column names whose corresponding values are passed as a metadata object to the `onRowClick` handler.
* `headerMetadata` (object): Object with data to include with the 
* `formatter` (object mapping names to functions): see separate section
* `selectedRow` (object): Applies 'selected' class to the table row matching the property in the object - E.g. {id: '1224'}.
* `sortedColumn` (string): Used to apply styling to the appropriate column.
* `sortOrder` (string): 'ascending' or 'decending' direction.
* `onRowClick` (function): callback function invoked when one of the lines in the table is clicked (typically to select a record for more detailed display).
* `onHeaderClick` (func[event, headerMetadata]): callback function invoked when one of the cells in the header is clicked (typically to choose a sort-order). By default, headerMetadata includes the column's data name as well as its alias, in case a object is supplied to the columnMapping prop.
* `columnMapping` (object) Maps rendered column labels to the data fields for the onHeaderClick prop. 
* `selectedClass` (string): override class for the default style applied to selected rows.
* `sortedClass` (string): override class for the default style applied to headers of sorted columns.
* `isEmptyMessage` (string): Message to display when the supplied contentData array is empty.
* `caption` (string or component): Fills in the `<caption>` element for the table. 

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

A formatter object can be used to render the author.firstName and author.lastName properties concatenated inside the corresponding table cell. Each property of the formatter object contains a function that returns a jsx element to be rendered:

```js
const resultsFormatter = {
      author: item => <td key={item.id}>{item.author.firstName} {item.author.lastName}</td>,
    };
    
<MultiColumnList
    contentData={catalogResults}
    formatter={resultsFormatter}
    visibleColumns={['title', 'author']}
/>   
```

