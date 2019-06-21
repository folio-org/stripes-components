# RepeatableField
Form component for rendering arrays of editable data.

## Usage
```
<RepeatableField
  addLabel="Add author"
  legend="Authors"
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

### With Redux Form
```js
<FieldArray
  addLabel="Add author"
  legend="Authors"
  component={RepeatableField}
  name="authors"
  onAdd={fields => fields.push('')}
  renderField={field => (
    <Field
      component={TextField}
      label="Name"
      name={field}
    />
  )}
/>

// With multiple fields
<FieldArray
  ...
  renderField={field => (
    <Row>
      <Col xs>
        <Field
          component={TextField}
          label="Name"
          name={`${field}.name`}
        />
      </Col>
      <Col xs>
        <Field
          component={TextField}
          label="Occupation"
          name={`${field}.occupation`}
        />
      </Col>
    </Row>
  )}
/>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
addLabel | string | Text for add field row button |
canAdd | boolean | Flag to enable/disable add button | true
canRemove | boolean | Flag to enable/disable remove button | true
emptyMessage | string | Text for when there are no rows; can be left blank |
fields | array or object | Values that go with field rows | &#10004;
id | string | Adds an ID for the root element and prefixed ID's for the default add button |
legend | node or string | Legend text that accompanies the fieldset; can be left blank |
onAdd | func | Callback fired when the add button is clicked |  | &#10004;
onRemove | func | Callback fired when the remove row button is clicked |  |
renderField | func | Render function for each field row |  | &#10004;
