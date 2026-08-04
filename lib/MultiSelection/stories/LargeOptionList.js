import React, { useState } from 'react';
import MultiSelection from '../MultiSelection';

// A large, fully-unvirtualized option list - MultiSelectOptionsList renders every item
// in renderedItems regardless of scroll position (see MultiSelectOptionsList.js), so
// this is the representative case for the content-visibility:auto / contain-intrinsic-size
// applied to .multiSelectOption in MultiSelect.css. Open the list, profile with DevTools
// Performance/Rendering panels, and verify keyboard navigation still reaches every option
// including ones scrolled out of view.
const optionList = Array.from({ length: 500 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}));

const LargeOptionList = () => {
  const [values, setValues] = useState([]);

  return (
    <div>
      <MultiSelection
        label="Large option list"
        id="large-option-list"
        dataOptions={optionList}
        value={values}
        onChange={setValues}
      />
    </div>
  );
};

export default LargeOptionList;
