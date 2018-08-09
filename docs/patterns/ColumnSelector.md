# Column Selector Pattern 

(refer `https://github.com/folio-org/ui-users/blob/master/lib/Loans/OpenLoans/OpenLoans.js`) for the patterns implementation

# Purpose

The column selector pattern is a way in which we could selectively allow/disallow columns to be displayed on the page.
This helps in situations where the width of the `<MultiColumnList>` exceeds the width of the page, but the user would  want to view only a specific set of columns for their needs, instead of having to scroll the page horizontally to get their desired information.

# Pattern flow

1) Display a dropdown button (might vary based on implementation requirements) on the page.
2) On clicking the dropdown display a dropdown menu with a list of checkboxes each corresponding to the column name.
3) Check/Uncheck the box to display/hide the corresponding column.

# Approach

The Column selector can be built with ease from our shared component library.

**Sequence of steps:**

1) Import the `<Dropdown>`, `<Checkbox>` and `<DropdownMenu>` components for showing the list of checkboxes.
2) Store the set of visible columns (which are the columns to be rendered on the page) in the state.
3) Render the checkboxes (used to toggle the visibility of individual columns) with the names of the columns.
4) Click the checkboxes to toggle the state of individual columns to show/hide them.
5) Pass down the visible columns from the state to the `<MultiColumnList>` component.

`Note` : You should not store status or render checkboxes for any columns that should never be hidden (such as checkboxes, ellipsis or other row-level controls.) These should not be present in the `controllableColumns` array (described below), but should always be present in the visibleColumns array which is returned from the `getVisibleColumns()` function. (Also described below.)

# Implementation

This section covers the variables required and the functions we need to implement this pattern:

**Variables required:**

`possibleColumns`: List of all the columns that can be displayed on the page, including `checkboxes` and `ellipsis`.
`controllableColumns`: List of all columns that can be toggled for visibility (excludes `checkbox` and `ellipsis`).
`visibileColumns`: An object that can be built from the controllableColumns list, with a key value pair of `title` and `status` respectively. Needs to be stored in the state. All the statuses are set to true (column is visible) initially.

```
const visibleColumns = this.controllableColumns.map(columnName => ({
      title: columnName,
      status: true,
    }));
```

```
Example: visibileColumns = {
      'due date': true,
      'loan Policy': false,
    }
```

**Variables that need to be stored in the state:**

- `visibleColumns` - Object containing a mapping of column name and its visibility status (true or false)
- `toggleDropdownState` - state of the dropdown, initially set to false. (implies the dropdown is not open)

**Functions required:**

- `getVisibleColumns()` - returns the array of visible columns whose status is true
- `renderCheckboxList(columnMapping)` - renders the list of checkboxes inside the `<DropdownMenu>` with names from the columnMapping object.        
- `toggleColumn()` - toggles the status of the column corresponding to the checkbox checked/unchecked.
- `onDropdownClick()` - toggles the visibility state of the DropdownMenu (toggleDropdownState) with the list of checkboxes.

Eventually, we pass down visibleColumns, returned from `getVisibleColumns()` function as a prop to `<MultiColumnList>` to render the selected columns.


```
<MultiColumnList
  ...
  visibleColumns={visibleColumns}
  ...
/>
```
