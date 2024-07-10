import { useState } from 'react';
import MultiSelection from '../MultiSelection';
import Button from '../../Button/Button';

const MultiSelectionHarness = ({
  initValue,
  label,
  options,
  onChange = () => {},
}) => {
  const [fieldVal, setFieldVal] = useState(initValue);

  return (
    <>
      <Button onClick={() => setFieldVal([])}>reset</Button>
      <MultiSelection
        label={label}
        value={fieldVal}
        dataOptions={options}
        onChange={(val) => { setFieldVal(val); onChange(val) }}
      />
    </>
  );
}

export default MultiSelectionHarness;
