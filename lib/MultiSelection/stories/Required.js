import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';
import Button from '../../Button';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

const RequiredExmaple = () => {
  const [values, setValues] = useState([]);

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitted!'); /* eslint-disable-line */
    }}
    >
      <MultiSelection
        required
        label="Required multi select"
        id="required-multiselect"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default RequiredExmaple;
