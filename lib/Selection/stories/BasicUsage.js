/**
 * Selection basic usage
 */

import { useState } from 'react';
import { Form, Field } from 'react-final-form';
import faker from 'faker';
import Selection from '../Selection';
import Button from '../../Button';
import { syncGenerate } from '../../MultiColumnList/stories/service';

function validateRequired(value) {
  return value ? undefined : 'Required';
}

const hugeOptionsList = syncGenerate(3000, 0, () => {
  const item = faker.address.city();
  return { value: item, label: item };
});

// the dataOptions prop takes an array of objects with 'label' and 'value' keys
const countriesOptions = [
  { value: '', label: 'blank' },
  { value: 'AU', label: 'Australia' },
  { value: 'CN', label: 'China' },
  { value: 'DK', label: 'Denmark' },
  { value: 'MX', label: 'Mexico' },
  { value: 'SE', label: 'Sweden' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  // ...obviously there are more....
];

const initialValues = {};

const BasicUsageStory = () => {
  const [value, setValue] = useState(null);

  const changeValue = (val) => {
    setValue(val);
  };

  const onSubmit = () => console.log('submit');

  return (
    <Form
      enableReinitialize
      keepDirtyOnReinitialize
      validateOnBlur
      subscription={{
        initialValues: true,
        submitting: true,
        pristine: true,
        values: true,
      }}
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form: { change } }) => (
        <>
          <Button onClick={() => change('SelectionCountry', 'MX')}>Set Value to MX (Mexico)</Button>

          <Field
            name="SelectionCountry"
            dataOptions={countriesOptions}
            fullWidth
            component={Selection}
            label="Country"
            validate={validateRequired}
          />

          <Button type="Submit" onClick={handleSubmit}>Submit</Button>
      </>
    )}
    />
  )
};

export default BasicUsageStory;
