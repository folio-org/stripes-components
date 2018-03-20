# Selection
Select-style dropdown box with a filterable options list.
## Usage
```
import Selection from '@folio/stripes-components/lib/Selection';

// the dataOptions prop takes an array of objects with 'label' and 'value' keys
const countriesOptions = [
  { value: 'AU', label: 'Austrailia' },
  { value: 'CN', label: 'China' },
  { value: 'DK', label: 'Denmark' },
  { value: 'MX', label: 'Mexico' },
  { value: 'SE', label: 'Sweden' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  // ...obviously there are more....
];

// later in your JSX....
<Selection
  name="SelectionCountry"
  label="Country"
  id="countrySelect"
  placeholder="Select country"
  dataOptions={countriesOptions}
/>
```
## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`dataOptions` | array of objects | Array of objects with `label` and `value` keys. The labels are visible to the users in the options list, the values are not. | | &#10004;
`id` | string | Sets the `id` html attribute on the control | |
`label` | string | If provided, will render a `<label>` tag with an `htmlFor` attribute directed at the provided `id` prop. | |
`emptyMessage` | string | Message to display filtering leaves the options list empty | 'No matching options' |
`listMaxHeight` | string | Sets a style attribute on options list, setting a max-height. list will scroll if the options list is too long to fit. | '174px' |
`rounded` | bool | Sets the 'rounded' style for the input (rounded corners via border-radius) | |
`value` | string | Sets the value for the control. **Not necessary if using redux-form.** | |
`onChange` | function | Callback function that will recieve the control's current value and the onChange event object. `fn(e, value)` **Not necessary if using redux-form,** but it will still work if callback from a change is needed.
`useValidStyle` | bool | if true, "success" styles will be applied to control if it contains a valid value `onBlur` (using redux-form validation.) | false |
## Usage in Redux-form
Redux form will provide `input` and `meta` props to the component when its used with a redux-form `<Field>` component. The component's value and validation are suplied through these.
```
<Field name="SelectionCountry" label="Country" id="countrySelect" placeholder="Select country" component={Selection} dataOptions={countriesOptions}/>

```
