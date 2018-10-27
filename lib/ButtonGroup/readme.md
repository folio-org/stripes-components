# Button Group
Creates a split button set that can be used for filters, tabs, and or groups of actions.

## Usage
`<ButtonGroup>` will accept one or more `<Button>` components as children.
```
// ...
<ButtonGroup>
  <Button>test</Button>
  <Button>it</Button>
  <Button>out</Button>
</ButtonGroup>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
children | | Set of `<Button>`s. |  |
className | string | Add a custom className to ButtonGroup | |
fullWidth | bool | Forces the button group width to 100% |
tagName | string | Set the HTML tag used to wrap the button set. | 'div' |
