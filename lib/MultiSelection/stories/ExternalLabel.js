import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

export default () => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <strong id="multiselect-label">My external label</strong>
      <MultiSelection
        ariaLabelledBy="multiselect-label"
        id="my-multiselect"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
      />
    </div>
  );
};
