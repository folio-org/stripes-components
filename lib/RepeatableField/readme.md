# RepeatableField
Form component for rendering arrays of editable data.

## Usage
```js
import { RepeatableField } from '@folio/stripes/components';

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

// With multiple fields
<FieldArray
  ...
  renderField={(field, index) => (
    <Row>
      <Col xs>
        <Field
          component={TextField}
          label="Name"
        />
      </Col>
      <Col xs>
        <Field
          component={TextField}
          label="Occupation"
        />
      </Col>
    </Row>
  )}
/>
```

### With Redux Form or React Final Form
```js
import { RepeatableField } from '@folio/stripes/components';

// Redux Form
import { FieldArray, Field } from 'redux-form';

// React Final Form
// More information: https://github.com/final-form/react-final-form-arrays
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

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

// With custom "onRemove"-callback
<FieldArray
  ...
  onRemove={(fields, index) => fields.remove(index)}
/>

// Hide remove button
<FieldArray
  ...
  onRemove={false}
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
onRemove | func | Callback fired when the remove row button is clicked. For redux forms: Pass `false` to hide remove buttons. A custom `onRemove`-callback can be passed if needed (`fields` and `index` will be passed as parameters). |  |
renderField | func | Render function for each field row |  | &#10004;
