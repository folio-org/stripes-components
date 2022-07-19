import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';
import Headline from '../../Headline';

const optionList = [
  { value: 'test0', label: 'Option 0' },
  { value: 'test1', label: 'Option 1' },
  { value: 'test2', label: 'Option 2' },
];

const HiddenLabel = () => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <Headline size="large">
        Multiselect with no visible label
      </Headline>
      <p>
        The &quot;ariaLabel&quot; prop is used to apply a label that
        is not visible to the user, but accessible to screenreaders.
        This is preferable for &quot;required&quot; fields over
        &quot;ariaLabelledby&quot; since the labeling elements will
        not need to display an asterisk.
      </p>
      <MultiSelection
        id="my-multiselect"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
        ariaLabel="My aria multiselect"
      />
    </div>
  );
};

export default HiddenLabel;
