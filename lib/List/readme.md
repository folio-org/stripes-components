# List

Displays a list with an array of items or children

### Props
Name | Type | Description | Default
--- | --- | --- | ---
listStyle | string | Switch between different styles | default
items | array | List of items to display in the list | null
itemFormatter | function | Use this function to format each item in the list (not needed if you are adding items as children instead of array) | null
children | node | Adds content as children instead of an array | null |
marginBottom0 | boolean | Removes the default bottom margin | false
listClass | string | Adds a class to the list | null
isEmptyMessage | string, node, array of nodes | Displays the content of this prop when the list is empty | null
