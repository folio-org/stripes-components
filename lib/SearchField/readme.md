# SearchField

Universal search field component.

## Basic Usage

```
  import { SearchField } from '@folio/stripes/components';

  <SearchField
    onChange={...}
    value={...}
    onClear={...}
    placeholder="Search for something"
  />
```

## Usage with searchable indexes
The component supports adding an array of searchable indexes which adds a select field to the component.

```
  import SearchField from '@folio/stripes/components';

  const searchableIndexes = [
    { label: 'ID', value: 'id' },
    { label: 'Title', value: 'title' },
    { label: 'Identifier', value: 'identifier', localOnly: true },
  ];

  <SearchField
    onChange={...}
    value={...}
    onClear={...}
    placeholder="Search for something"

    searchableIndexes={searchableIndexes}
    onChangeIndex={() => ...}
    selectedIndex={...}
    searchableIndexesPlaceholder="Search for these fields.."
  />
```

## Props
This component supports the same props as the TextField component among other props.

Name | type | Description
-- | -- | --
placeholder | string | Adds a placeholder to the search input field
id | string | Adds an ID to the input field
className | string | Adds a className to the root element
inputClass | string | Adds a className to the input
ariaLabel | string | Adds an aria label to the input field
value | string | The value of the input field
loading | boolean | Adds a loading state to icon (on fetch etc.)
onChange | function | On change handler for the input field
onClear | function | On clear search field callback
clearSearchId | string | Adds id to the clear search icon

### With searchable indexes
Additional props for adding searchable indexes/fields.

Name | type | Description
-- | -- | --
searchableIndexes | array of objects | Adds a list of searchable indexes/fields
selectedIndex | string | Currently selected index
onChangeIndex | function | On change handler for when changing index
searchableIndexesPlaceholder | string | Control the placeholder of the select field
