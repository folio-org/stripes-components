# MultiSelection

`select[multiple]` alternative which allows filtering for long lists of options via a text field. The behavior of filtering is similar to a type-ahead or suggestion list. The value is returned as an array. Selected values are displayed as value 'chips' - they can be removed by clicking their "X" button -or- simply be toggled off in the options list. The control is fully navigable via keyboard, without use of any modifier keys.

## Basic Usage
```
import { MultiSelection } from '@folio/stripes/components';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
  // ...
];

/* ... later in JSX */
<MultiSelection
    label="my multiselect"
    id="my-multiselect"
    dataOptions={optionList}
/>
```

## Common Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`actions` | array of objects | array of non-selectable actions that would be present in the list - for example, an 'add tag' functionality where a user can add their entered filter word to the list of available values. See the **actions** section below | [] |
`asyncFiltering` | bool | if true, it's up to the surrounding app to apply a filter handler and pass its resulting list through to the `dataOptions` prop. | false |
`backspaceDeletes` | bool | if true, the user can press the backspace key when the option filter is empty to remove the last selected item in the value list | true |
`dataOptions` | array of objects | An array that represents possible objects. Default props are set up to treat objects with the shape of `{value<any>, label:<string>}`. | |
`emptyMessage` | string | feedback message for user when options list is empty (they've entered an option filter with no results,) | 'No matching items found!' |
`filter` | func | a custom filter function. If you're not using `asyncFiltering` It should return an object with the shape of `{renderedItems:<array>}` This object can include additional properties that can be used for conditional rendering of `action`s. | the default filter is via reg-ex on the items' `label` field |
`formatter` | func | Render function that accepts an object with keys for the option and the current filter string. The function is called to display values in the options dropdown and in the selected values list. A default `formatter` is provided. | [DefaultOptionFormatter](../Selection/DefaultOptionFormatter.md) |
`id` | string | Sets the `id` attribute for the control. Other interior id's are generated using this string as a prefix. | |
`itemToString` | <string>func | Function used to return a single string representation of its value. For example, option objects with a shape of `{label:<string>, value:<object>}` would use `item => (item ? item.label : '')` for their toString function. This is used to generate strings so that values can accurately be announced for screen readers. | `item => (item ? item.label : '')` |
`label` | string | Used as the form label for the field. Appropriate label/field relationship for accessibility is automatically set up by the component. | |
`maxHeight` | number | The maximum height of the options menu in pixels. This does not include the heigh of any validation messages that may also appear with the menu. | `168` |
`onBlur` | func | Blur event handler for when the user blurs the filter field | |
`onChange` | func | Change event handler for when internal state changes. `selectedItems` is passed as parameter to function. | |
`onRemove` | func | Event handler specifically called when an item is removed from the selection. The removed item is passed to the handler. | |
`placeholder` | string | Rendered as a placeholder for the control when no value is present. | |
`renderToOverlay` | bool | For use in situations where the dropdown may be cut off due to a containing dom element's `overflow: hidden/auto` css attribute. | false |
`tether` | object | Override settings for the tether when `renderToOverlay` is used. | default tether object provided. |
`value` | array | Array of selected objects. | |

## Validation props
These are props that could be applicable if setting up your own validation system. These would probably best be handled within `onChange` and `onBlur` event handlers.

Name | type | description | default | required
--- | --- | --- | --- | ---
`dirty` | bool | Apply a specific style when the value has changed. | false |
`error` | string | Text to display as inline validation feedback for the user. A truthy value here will also apply validation styling to the control. | |
`isValid` | bool | Whether or not field is valid. When true, specific styles are applied. | |
`touched` | bool | Prop that controls application of validation styles. Redux-form applies this prop automatically. This defaults to false. | false |
`validationEnabled` | bool | Controls whether or not validation styles are rendered. | false |
`warning` | string | Text to display as inline validation feedback for the user. A truthy value here will also apply validation styling to the control. | |

## Shape of dataOptions
The shape of the items in your dataOptions array may require you to pass additional props. The default props are set up to handle dataOptions with `label` and `value` keys. If your options do not have label and value keys, here are some other props to be sure you're setting:

* `itemToString` - string for accessible announcement of the item's status. "<item> has been removed"
* `filter` - function to use when filtering the options list. Should return an object with renderedItems holding the resulting array as a key.
* `formatter` - function for rendering the options in the dropdown and selected items list.

### Example
```
// if the data options are an array of strings instead of objects

dataOptions = [ 'one', 'two', 'three' ];
toString = (option) => option;
formatter = ({option}) => <div>{option}</div>;

filterItems = (filterOptions = (filterText, list) => {
  const filterRegExp = new RegExp(`^${filterText}`, 'i');
  const renderedItems = filterText ? list.filter(item => item.search(filterRegExp) !== -1) : list;
  return { renderedItems };
};

<MultiSelect
  itemToString={this.toString}
  formatter={this.formatter}
  filter={this.filterItems}
/>
```
## Formatting with `<OptionSegment>`
We provide an `<OptionSegent>` component for use in formatters to enable nice features like the bolding of filter values in results - so a filter of 'in' will display resulting options like '**in**put', '**in**dustry','**in**novation'.
```
import { OptionSegment } from '@folio/stripes/components';

formatter= ({option, searchTerm}) => <OptionSegment searchTerm={searchTerm} >{option}</OptionSegment>;

//...rest of code...
```
## Actions
Some use cases may require an item in the options list to perform a function rather than simply set/toggle a value. An example of this would be for a tagging system to add the string that a user has entered as a search term as a new tag.
```
addTag = ({ renderedItems, exactMatch, filterText }) => {
    ... logic to push new option with 'filterText' as its `label` key.
}

renderAddTag = ({ filterValue, exactMatch }) => {
    if (exactMatch) {
      return null;
    } else {
      return <div>Add tag for &quot;{`${filterValue}`}&quot;</div>;
    }
}

addAction = { onSelect: this.addTag, render: this.renderAddTag }

actions = [this.addAction];

/* later in JSX */
<MultiSelection
  dataOptions={listOptions}
  actions={actions}
/>
```

## Async Filtering
Sometimes if a list of potential options is very large, it may be handled by the server. The `asyncFiltering` prop can be used along with your own `filter` function that controls the `dataOptions` prop. In this scenario, if dataOptions is left undefined or null, the dropdown list will render a loading spinner.
```
  <MultiSelect
    asyncFiltering
    filter={this.handleFilter}
    dataOptions={this.state.options}
  />
```
