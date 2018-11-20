# MenuSection
Define menu sections with labels. Useful for creating multisectioned dropdown menu's.

## Basic Usage
`<MenuSection>` can be used to compose menus with a combination of various components passed as children. 

Bottom margin will be added automatically when stacking `<MenuSection>`'s.

```js 
import { Pane, Paneset } from '@folio/stripes/components';

<MenuSection label="Layout">
  <RadioButton name="layout" label="Automatic layout" />
  <RadioButton name="layout" label="Always use table layout" />
  <RadioButton name="layout" label="Always use cards layout" />
</MenuSection>

<MenuSection label="Columns">
  <Checkbox label="Name" />
  <Checkbox label="Email" />
  <Checkbox label="Barcode" />
</MenuSection>

<MenuSection label="Actions">
  <Button buttonStyle="dropdownItem">
    <Icon icon="trashBin">Delete</Icon>
  </Button>
  <Button buttonStyle="dropdownItem">
    <Icon icon="edit">Batch edit</Icon>
  </Button>
  <Button buttonStyle="dropdownItem">
    <Icon icon="bookmark">Bookmark</Icon>
  </Button>
</MenuSection>
```

## Props
Additional props passed to MenuSection will be spread on the root element.

Name | Type | Description
children | node | Adds content to the MenuSection
className | string | Apply a custom class name to the root element of MenuSection
label | string, node | Renders a label on the MenuSection