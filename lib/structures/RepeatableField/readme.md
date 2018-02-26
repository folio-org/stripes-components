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
addButtonId | string | HTML `id` attribute to assign to the add button. If not provided, one will be generated. | |
template | array of objects | Each object within the array represents props that will be passed to the rendered redux-form `<Field>` inputs. | | yes
newItemTemplate | object | Object representing the default field values applied when a new item is added to the array. | | yes
addDefaultItem | bool | Sets whether or not the list will add a default, empty item. | `false` |

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

## Custom Field components

The `component` property of the `template` array can be used to pass in an existing component. If deeper control of props is necessary, such as option lists for `<Select>` inputs being manipulated based on `field` settings, you can pass a rendering function through to a `render` key on the template object instead of using the `component` key. The function will be passed the `fields` object, `field`, `fieldIndex`, `template`, `templateIndex` for use within your render function.

```
const renderLanguageField = ({fields, field, fieldIndex, template, templateIndex}) => {
  const languageOptions = languages.selectOptions(field);
  return (
    <Field
      label={fieldIndex === 0 ? 'language' : null}
      name={`${field}`}
      component={Select}
      dataOptions={[{ label: 'Select language', value: '' }, ...languageOptions]}
    />
  );
}

class LanguageFields extends React.Component {
  render() {
    return (
      <RepeatableField
        name="languages"
        label="Languages"
        addLabel="+ Add language"
        addId="clickable-add-language"
        template={[{
          render: renderLanguageField
        }]}
      />
    );
  }
}
```
