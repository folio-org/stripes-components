# FilterPaneSearch
A pre-built component that can be used to replace that can be supplied to `<Pane>`'s `header` prop. It will replace the default header with a search text input - complete with icons, clear and an included [`<FocusLink>`](../FocusLink/readme.md) for keyboard navigation to skip to the results list.

## Usage
```
const searchHeader = (
  <FilterPaneSearch
    id="SearchField"
    onChange={this.onChangeSearch}
    onClear={this.onClearSearch}
    value={this.state.searchTerm}
    resultsList={this.resultsList}
    searchAriaLabel="Users search"
  />
);

<Pane header={searchHeader}/>
```

## Properties
Name | type | description | default | required
--- | --- | --- | --- | ---
searchFieldId | string | String to be supplied to the text input's "id" attribute. | |
clearSearchId | string | String to be supplied to the clear button's "id" attribute. | |
onChange | func | Event handler for when the text of the input changes. | |
onClear | bool | Event handler for when the 'clear' button of the searchfield is clicked.| |
value | string | value for the text input. | |
resultsList | `ref` | a `ref` to the result-rendering component's outer element. [More information on refs](https://facebook.github.io/react/docs/refs-and-the-dom.html). If this prop is provided, the searchfield will render a skip link that will allow keyboard navigation users to skip directly to the search results. It will only be visible when focused using the tab key.| |
searchAriaLabel | string | `aria-label` to apply to the text input. | |
