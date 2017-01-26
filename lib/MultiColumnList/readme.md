# MultiColumnList

Renders an array of data objects as a table where each object is a row and each property of the objects is a column. Props are exposed to apply row selection (onRowClick) and sorting (onHeaderClick). 
### Basic Usage:
```js 
const catalogResults = [
    {title:'Microbiology Today', author:'James Edward'},
    {title:'Orange Book', author:'Philip Ramos'},
]

<MultiColumnList contentData={catalogResults} />
```

You can also:
  - Specify which properties(columns) to render, as well as the order in which they render
  - Specify propertiess of the data to be passed to the handlers of row clicks.
  - Specify a formatter object to control exactly how the data is rendered.

### Formatter
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
    fullWidth
/>   
```

