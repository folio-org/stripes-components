# AutoSuggest
Displays a dropdown with a list of suggestions based on the entered string in the textfield.

## Usage
```
import { AutoSuggest } from '@folio/stripes/components';

// later in your JSX....
<AutoSuggest items={items} />
```

## AutoSuggest Configuration
prop | description | default | required
-- | -- | -- | --
includeItem | Callback that returns whether to include the item in the list of results. | `(item, searchString) => item.value.includes(searchString)` |
items | List of items to display | | Yes
onChange | Callback called when the value changes | |
renderOption | Callback that renders the item in the dropdown | `item => item.value` |
renderValue | Callback that render the item in the input field | `item => item.value` |
valueKey | The key in the item object to use as the value. | `"value"`