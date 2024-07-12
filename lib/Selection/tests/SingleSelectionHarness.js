import { useState } from 'react';
import Selection from '../Selection';
import Button from '../../Button/Button';

const SingleSelectionHarness = ({
  initValue,
  label,
  options: optionsProp,
  delayedOptions = [],
  onChange = (fn, val) => { fn(val) },
}) => {
  const [fieldVal, setFieldVal] = useState(initValue);
  const [options, updateOptions] = useState(optionsProp);
  const [increment, updateIncrement] = useState(0);
  return (
    <>
      <Button onClick={() => setFieldVal('')}>reset</Button>
      <Button onClick={() => setTimeout(updateOptions(delayedOptions), 100)}>fillData</Button>
      <Button onClick={() => updateIncrement((cur) => cur + 1)}>{`update(${increment})`}</Button>;
      <Selection
        label={label}
        value={fieldVal}
        dataOptions={options}
        onChange={(val) => { onChange(setFieldVal, val) }}
      />
    </>
  );
}

export default SingleSelectionHarness;
