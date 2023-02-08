import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

const BasicUsage = () => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <MultiSelection
        label="my multiselect"
        id="my-multiselect"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
        onRemove={(item) => { alert(`item removed: ${item.label}`); }} // eslint-disable-line no-alert
      />
    </div>
  );
};

export default BasicUsage;
