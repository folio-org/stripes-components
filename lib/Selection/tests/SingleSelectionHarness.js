import { useState } from 'react';
import Selection from '../Selection';
import Button from '../../Button/Button';

const SingleSelectionHarness = ({
  initValue,
  label,
  options,
  onChange = () => {},
}) => {
  const [fieldVal, setFieldVal] = useState(initValue);

  return (
    <>
      <Button onClick={()=>setFieldVal('')}>reset</Button>
      <Selection
        label={label}
        value={fieldVal}
        dataOptions={options}
        onChange={(val) => { setFieldVal(val); onChange(val)}}
      />
    </>
  );
}

export default SingleSelectionHarness;
