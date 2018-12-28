# CheckboxFilter

A stateless component. Represents a set of Checkbox components working like one filter. 

## Basic Usage
```
import { CheckboxFilter } from '@folio/stripes/components';

const options = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ge', label: 'German' },
  // ...
];

/* ... later in JSX */
<CheckboxFilter
  name="language"
  options={options}
  onChange={({name, values}) => {}}
/>      
```

## Common Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`name` | string | Filter name |
`options` | array of objects | A set of filter options to be rendered as checkboxes. Set up to treat objects with the shape of `{value:<any>, label:<string>, disabled:<boolean>, readOnly:<boolean>}` |
`onChange` | func | Callback to be called when a filter value changes. Receives `{name:<string>, values:<array>}`, where the name is a filter name and values is all selected values of the filter. Values is an array of strings. | |
`selectedValues` | array of strings | A list of selected filter values |