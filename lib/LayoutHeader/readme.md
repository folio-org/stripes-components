# LayoutHeader
Layout component for the section motif of FOLIO with customizeable title and actions.
Defaults to having a single default action.

## Usage
```
<LayoutBox>
  <LayoutHeader title="Section" onDelete={()=>{}}/>
  <div>Content in section</div>
</LayoutBox>
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
title | string | text for the header of the section | |
level | number | The header level of the rendered `<Hx>` tag. (1-6). | 3 |
actions | array of `{ name, icon, handler }` | see examples | |
onDelete | function | to support delete actions in the simplest use case. | |
noActions | bool | hides action buttons. Useful for 'read-only' mode. | |

## Custom Actions
The actions prop can be used to supply a custom set of rendered buttons with icons. The type is an array of objects with the shape of:
```
[
  {
    name: string,
    icon: string,
    handler: function
  },
  ...
]
```

The simple delete action configuration looks like this:

```
[
  {
    name: 'Delete',
    icon: 'trash',
    handler: props.onDelete,
  },
]
```
The array will render out as buttons containing icons.
