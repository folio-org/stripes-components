# Repeatable Field
Form component for rendering arrays of editable data.

## Usage
This example renders a list of items where multiple fields (a `<TextField>` and a `<Select>` field) are rendered for each item:

```
  <RepeatableField 
    name="things"
    label="List of multi-field values"
    addLabel="+ Add a multi-field item"
    template= {[{
        name:"name",
        component: TextField,
      },
      {
        name:"type",
        component: Select,
        dataOptions: [{label:"Type 1", value: "1"}, {label: "Type 2", value: "2"}, {label: "Type 3", value: "3"}],
      },
    ]}
    newItemTemplate= {{name:"", type:"1"}}
  />
```

## Props

Name | type | description | default | required
--- | --- | --- | --- | ---
name | string | Name of particular array of data that the rendered array of fields will refer to. |  | yes
label  | string | The visible label of the array of fields | | yes
addLabel | string | text for the 'Add item' button that's rendered with the fields. | | 
template | array of objects | Each object within the array represents props that will be passed to the rendered redux-form `<Field>` inputs. | | yes
newItemTemplate | object | Object representing the default field values applied when a new item is added to the array. | | yes

## Single field example
Renders a single `<TextField>` for each item...
```
<RepeatableField 
  name="singleFields"
  label="List of single values"
  addLabel="+ Add a field"
  template= {[{
    name:"name",
    component: TextField,
  }]}
  newItemTemplate= {{name:""}}
/>
```