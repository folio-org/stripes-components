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
```

### With multiple fields
```js
<RepeatableField
  legend="People"
  addLabel="Add person"
  fields={fields}
  onAdd={this.handleAdd}
  onRemove={this.handleRemove}
  renderField={(field, index) => (
    <Row>
      <Col xs={6} sm={4}>
        <TextField
          autoFocus
          label="Name"
          name={`people[${index}].name`}
          id={`people-input-name-${index}`}
          onChange={this.handleChange('name', index)}
          value={field.name}
        />
      </Col>
      <Col xs={6} sm={4}>
        <TextField
          label="Age"
          name={`people[${index}].age`}
          id={`people-input-age-${index}`}
          onChange={this.handleChange('age', index)}  
          value={field.age}
        />
      </Col>
      <Col xs={12} sm={4}>
        <TextField
          label="Occupation"
          name={`people[${index}].occupation`}
          id={`people-input-occupation-${index}`}
          onChange={this.handleChange('occupation', index)}  
          value={field.occupation}
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

### With `headLabels` property to display heading field labels
```js
import { RepeatableField, Label } from '@folio/stripes/components';

const headLabels = (
  <Label id="authorLabel">
    Author
  </Label>
);

<RepeatableField
  addLabel="Add author"
  legend="Authors"
  headLabels={headLabels}
  fields={fields}
  onAdd={this.handleAdd}
  onRemove={this.handleRemove}
  renderField={() => (
    <TextField
      name="author"
      aria-labelledby="authorLabel"
    />
  )}
/>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
addLabel | string | Text for add field row button |
canAdd | boolean | Flag to enable/disable add button | true
canRemove | boolean | Flag to enable/disable remove button | true
className | string | Adds a custom class name for the root element |
emptyMessage | string | Text for when there are no rows; can be left blank |
fields | array or object | Values that go with field rows | &#10004;
headLabels | node | Element that displays heading field labels. Developer should care about accessibility if this property is used (see an example).   |
id | string | Adds an ID for the root element and prefixed ID's for the default add button |
legend | node or string | Legend text that accompanies the fieldset; can be left blank |
onAdd | func | Callback fired when the add button is clicked |  | &#10004;
onRemove | func | Callback fired when the remove row button is clicked. For redux forms: Pass `false` to hide remove buttons. A custom `onRemove`-callback can be passed if needed (`fields` and `index` will be passed as parameters). |  |
renderField | func | Render function for each field row |  | &#10004;
