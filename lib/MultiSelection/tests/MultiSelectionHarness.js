import { useState } from 'react';
import MultiSelection from '../MultiSelection';
import Button from '../../Button/Button';

const MultiSelectionHarness = ({
  initValue,
  label,
  options,
  onChange = (fn, val) => { fn(val) },
}) => {
  const [fieldVal, setFieldVal] = useState(initValue);
  const [increment, updateIncrement] = useState(0);

  return (
    <>
      <Button onClick={() => setFieldVal([])}>reset</Button>
      <Button onClick={() => updateIncrement((cur) => cur + 1)}>{`update(${increment})`}</Button>;
      <MultiSelection
        label={label}
        value={fieldVal}
        dataOptions={options}
        onChange={(val) => { onChange(setFieldVal, val) }}
      />
    </>
  );
}

export default MultiSelectionHarness;
