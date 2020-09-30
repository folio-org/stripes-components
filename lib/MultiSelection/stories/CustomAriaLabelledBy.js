import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';
import Button from '../../Button';
import Headline from '../../Headline';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

const CustomAriaLabelledBy = () => {
  const [values, setValues] = useState([]);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Headline size="large" id="my-custom-aria-labelledby">
        Multiselect with an external label
      </Headline>
      <MultiSelection
        aria-labelledby="my-custom-aria-labelledby"
        required
        id="required-multiselect"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CustomAriaLabelledBy;
