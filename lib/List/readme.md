# List

Displays a list with an array of items or children

### Basic Usage

The items-prop is your array of times and the itemFormatter is a function that determines how to format each item.

```
  import List from '@folio/stripes-components/lib/List';

  const items = ['Apples', 'Bananas', 'Strawberries', 'Oranges'];
  const itemFormatter = (item) => (<li>{item}</li>);
  const isEmptyMessage = 'No items to show';

  <List
    items={items}
    itemFormatter={itemFormatter}
    isEmptyMessage={isEmptyMessage}
  />
```

### Props
Name | Type | Description | Default
--- | --- | --- | ---
listStyle | string | Switch between different styles | default
items | array | List of items to display in the list | null
itemFormatter | function | Use this function to format each item in the list | null
marginBottom0 | boolean | Removes the default bottom margin | false
listClass | string | Adds a class to the list | null
isEmptyMessage | string, node, array of nodes | Displays the content of this prop when the list is empty | null
