import React from 'react';
import MultiSelection from '../MultiSelection';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

const BasicUsage = () => (
  <div>
    <MultiSelection
      label="my multiselect"
      id="my-multiselect"
      dataOptions={optionList}
    />
  </div>
);

export default BasicUsage;
