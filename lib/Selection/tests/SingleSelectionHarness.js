import { useState } from 'react';
import Selection from '../Selection';
import Button from '../../Button/Button';

const SingleSelectionHarness = ({
  initValue,
  options: optionsProp,
  delayedOptions = [],
  onChange = (fn, val) => { fn(val) },
  forcedValue,
  ...props
}) => {
  const [fieldVal, setFieldVal] = useState(initValue);
  const [options, updateOptions] = useState(optionsProp);
  const [increment, updateIncrement] = useState(0);
  return (
    <>
      <div id="OverlayContainer" />
      <Button onClick={() => { setFieldVal(''); updateOptions(optionsProp); }}>reset</Button>
      <Button onClick={() => setFieldVal(forcedValue || optionsProp[1].value)}>set value</Button>
      <Button onClick={() => setTimeout(updateOptions(delayedOptions), 100)}>fillData</Button>
      <Button onClick={() => updateIncrement((cur) => cur + 1)}>{`update(${increment})`}</Button>;
      <Selection
        value={fieldVal}
        dataOptions={options}
        onChange={(val) => { onChange(setFieldVal, val) }}
        {...props}
      />
    </>
  );
}

export default SingleSelectionHarness;
