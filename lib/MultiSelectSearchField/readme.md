# SearchField

Universal search field component.

## Basic Usage

```
  import { MultiSelectSearchField } from '@folio/stripes/components';

  <MultiSelectSearchField
    onChange={...}
    value={...}
    onClear={...}
    placeholder="Search for something"
    isAdvancedSearch="true"
  />
```

## Usage with searchable indexes
The component supports adding an array of searchable indexes which adds a select field to the component.

```
  import MultiSelectSearchField from '@folio/stripes/components';

  const searchableIndexes = [
    { label: 'ID', value: 'id' },
    { label: 'Title', value: 'title', placeholder: 'Search by Title' },
    { label: 'Identifier', value: 'identifier', localOnly: true },
  ];

  <MultiSelectSearchField
    onChange={...}
    value={...}
    onClear={...}
    placeholder="Search for something"
    isAdvancedSearch="true"
    searchButtonRef={searchButtonRef}

    searchableIndexes={searchableIndexes}
    onChangeIndex={() => ...}
    selectedIndex={...}
    searchableIndexesPlaceholder="Search for these fields.."
  />
```

## Props
This component supports all props of the SearchField component and isAdvancedSearch boolean property, which changes the 
TextField component to MultiSelect, and a searchButtonRef property, which gives the ability to use Enter in textarea 
field without transfer to the next line.

Name | type | Description
-- | -- | --
placeholder | string | Adds a placeholder to the search input field
id | string | Adds an ID to the input field
className | string | Adds a className to the root element
inputClass | string | Adds a className to the input
aria-label | string | Adds an aria label to the input field. Camel-case `ariaLabel` is also accepted.
value | string | The value of the input field
loading | boolean | Adds a loading state to icon (on fetch etc.)
onChange | function | On change handler for the input field
onClear | function | On clear search field callback
clearSearchId | string | Adds id to the clear search icon
isAdvancedSearch | boolean | Rendering a MultiSelectSearch component instead of the TextField
searchButtonRef | object | Supplies a ref to the search button

### With searchable indexes
Additional props for adding searchable indexes/fields.

Name | type | Description
-- | -- | --
searchableIndexes | array of objects | Adds a list of searchable indexes/fields
selectedIndex | string | Currently selected index
onChangeIndex | function | On change handler for when changing index
searchableIndexesPlaceholder | string | Control the placeholder of the select field
