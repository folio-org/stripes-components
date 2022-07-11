import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

const NoAriaLabel = () => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <Headline size="large">
        Multiselect with no Aria label
      </Headline>
      <MultiSelection
        id="my-multiselect"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
      />
    </div>
  );
};

export default NoAriaLabel;
