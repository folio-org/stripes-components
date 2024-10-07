# Selection
Select-style dropdown box with a filterable options list.
## Usage
```
import { Selection } from '@folio/stripes/components';

// the dataOptions prop takes an array of objects with 'label' and 'value' keys
const countriesOptions = [
  { value: 'AU', label: 'Australia' },
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
## Formatting options
The `formatter` prop can be used to pass through a functional component that will be used to render the content of each of the options in the list as well as the selected value. The `<OptionSegment>` component allows control over the search highlighting of the string. The formatter should be prepared to accept an option (item from `dataOptions`) and the entered `searchTerm`. If no term is entered, `''` is passed. In this contrived example, both value and option strings are rendered in each option.

```
import { Selection, OptionSegment } from '@folio/stripes/components';

const options = [
  { value: '', label: 'None' },
  { value: 'AU', label: 'Austrailia' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
];

// formatter set up as an arrow function within a class - best to define outside of the render() function.

customFormatter = ({ option, searchTerm }) => {
  return (
    < key={option.value}>
      <OptionSegment searchTerm={searchTerm !== '' ? option.value : ''}>{option.value}</OptionSegment>
      <OptionSegment searchTerm={searchTerm}>{option.label}</OptionSegment>
    </>
  );
}

// ...within the render function...
  <Selection
    name="SelectionCountry"
    formatter={this.customFormatter}
    onChange={this.handleChange}
    label="Country"
    id="countrySelect"
    placeholder="Select country"
    dataOptions={countriesOptions}
  />
```


## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`asyncFilter` | bool | Set to `true` if your `onFilter` function makes a request for updated `dataOptions` rather than filter the `dataOptions` directly on the front-end. | `false` | false
`dataOptions` | array of objects | Array of objects with `label` and `value` keys. The labels are visible to the users in the options list, the values are not. | | &#10004;
`id` | string | Sets the `id` html attribute on the control | |
`inputRef` | object/func | Reference object/function for accessing the contro button DOM element. | ref | false
`label` | string | If provided, will render a `<label>` tag with an `htmlFor` attribute directed at the provided `id` prop. | |
`emptyMessage` | string | Message to display filtering leaves the options list empty | 'No matching options' |
`loading` | bool | if true, `loadingMessage` will be displayed to indicate that options are loading | false |
`loadingMessage` | string | Message to display that options list is loading | 'Loading options...' |
`listMaxHeight` | string | Sets a style attribute on options list, setting a max-height. list will scroll if the options list is too long to fit. | '174px' |
`formatter` | function |  Used to customize the formatting of options. The `<OptionSegment>` component enables control over filter highlighting. Formatter results are rendered within a flexbox `<div>`. | `DefaultOptionFormatter` |
`optionAlignment` | string | One of `start`, `end`, `outside`, `center`. Determines the alignment of OptionSegments and block elements that appear within the `formatter`.
`value` | string | Sets the value for the control. **Not necessary if using redux-form.** | |
`onChange` | function | Callback function that will receive the control's current value and the onChange event object. `fn(e, value)` **Not necessary if using redux-form**, but it will still work if callback from a change is needed.
`onFilter` | function | Callback function used for custom data filtering | | false |
`useValidStyle` | bool | if true, "success" styles will be applied to control if it contains a valid value `onBlur` (using redux-form validation.) | false |
`autoFocus` | bool | If this prop is `true`, control will automatically focus on mount | |
`popper` | object | Used to adjust placement of options list overlay via underlying Popper component. [See `<Popper>` props](../Popper/readme.md) | | false |
`usePortal` | bool | If `true`, option list will render to the `div[#OverlayContainer]` element in the FOLIO UI. Given the container of this component, `usePortal` may not be required. See [portals documentation](https://folio-org.github.io/stripes-components/iframe.html?viewMode=docs&id=guides-ui-layout--docs#portals) for guidance. | |

## Labeling
Like other form controls in stripes-components, `<Selection>` abides by standard conventions for labeling props if alternatives to `label` (visible label with the control) are required... `aria-label` and `aria-labelledby` are useful for this. See [Accessiblity for developers documentation](https://github.com/folio-org/stripes-components/blob/master/guides/AccessibilityDevPrimer.stories.mdx#labeling) for more details about which to choose.

## Option grouping
This adds group headings to the list and will indent child options. `dataOptions` can simply supply an `options` key rather than a `value` key that contains a list of child `dataOptions`. Grouped and non-grouped options can be specified simultaneously.

```
dataOptions = {[
  { label: 'top-level foo', value: 'foo first value' },
  { label: 'group label', options:
    [
      {label: 'grouped one' foo', value: 'grouped1'},
      {label: 'grouped two' foo', value: 'grouped1'},
      {label: 'grouped three' foo', value: 'grouped1'},
    ]
  },
  { label: 'top-level after group', value: 'foo last value' },
]}
```
See storybook for complete usage example.

## Async Filtering
Default functionality of `<Selection>` is client-side filtering of options, but it can set up to perform filtering via a request which would simply update the provided `dataOptions` list. Just provide the `asyncFilter` boolean prop and implement something similar to the following example for your `onFilter` function.

```
const [data, setData] = useState(hugeOptionsList);
const [loading, setLoading] = useState(false);

const handleFilter = async (filter) => {
  setLoading(true);           // So that the component can render a loading spinner while the user waits...
  setData([]);                // empty data so that none will render...
  const newData = await ...   // perform request here...
  setData(newData);           // supply the new dataOptions
  setLoading(false);          // turn off the loading spinner...
};

<Selection
  label="Async select"
  dataOptions={data}
  asyncFilter
  onFilter={handleFilter}
  loading={loading}
/>
```

## Usage in React Final Form
Redux form will provide `input` and `meta` props to the component when it is used with a redux-form `<Field>` component. The component's value and validation are supplied through these.
```
<Field name="SelectionCountry" label="Country" id="countrySelect" placeholder="Select country" component={Selection} dataOptions={countriesOptions}/>

```
