# RepeatableField
Form component for rendering arrays of editable data.

## Usage
```
<RepeatableField
  addLabel="+ Add author"
  fields={fields}
  onAdd={this.handleAdd}
  onRemove={this.handleRemove}
  renderField={() => (
    <TextField
      label="Author"
      name="author"
    />
  )}
/>
```

### With React Final Form Arrays
```
<FieldArray
  addLabel="+ Add author"
  component={RepeatableField}
  name="authors"
  renderField={(field, index) => (
    <Field
      component={TextField}
      label="Name"
      name={`name[${index}]`}
    />
  )}
/>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
addLabel | string | Text for add field row button |
emptyMessage | string | Text for when there are no rows; can be left blank |
fields | array or object | Values that go with field rows | &#10004;
legend | node or string | Legend text that accompanies the fieldset; can be left blank |
onAdd | func | Callback fired when the add button is clicked |  | &#10004;
onRemove | func | Callback fired when the remove row button is clicked |  | &#10004;
renderField | func | Render function for each field row |  | &#10004;
