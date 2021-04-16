
# Pagination
The Pagination component is used for nagivation between pages of a list of results.

We use [react-paginate](https://github.com/AdeleD/react-paginate) under the hood, more detail can be found at their we expose their API along with a few useful props.

## Basic Usage

```

  // take actions within your app corresponding to the selected page...
  const handlePageClick = (page) => {
    // page is an object with {selected} property - which gives the currently selected page index.
    // console.log(page);
  }

  // generate the hrefs for links if necessary (return the full string)
  const resultsHrefBuilder = (page) => {
    // return '#';
  }

  <Pagination
    pageCount={20}
    onPageChange={handlePageClick}
    hrefBuilder={resultsHrefBuilder}
  />
```

## Props

Name | type | description | default | required
--- | --- | --- | --- | ---
  `id` | string | Applies the 'id' attribute to the outer `<nav>` element | --- | ---
  `pageCount`| number | Used to set starting/ending page numbers (1 - pageCount) | --- | required
  `onPageChange` | func | --- | function called when page button is clicked | ---
  `hrefBuilder` | func | function for generating hrefs for individual buttons. Provides the page object  | ---
  `fillWidth` | bool | if `true`, pagination will fill its parent container, placing previous and next buttons at either end, with page buttons distributed evenly between | false | ---
  `currentPage` | number | manually sets the current page | --- | ---
  `label` | string | label for outer `<nav>` element | --- | 'pagination' | ---
  `showLabels` | bool | whether or not to display the visible "previous" and "next" labels. | true | ---

 