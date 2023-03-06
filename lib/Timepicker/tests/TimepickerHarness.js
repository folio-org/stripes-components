import React from 'react';
import _omit from 'lodash/omit';
import Timepicker from '../Timepicker';
import Button from '../../Button';


export default ({ initialValue = '', ...props }) => {
  const [time, updateTime] = React.useState(initialValue);

  const handleClearTime = React.useRef(() => { updateTime(''); }).current;

  const handleChange = (e) => {
    updateTime(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  }

  const getAdjustedProps = (harnessProps) => {
    const restProps = _omit(harnessProps, 'onChange');
    return props.useInput ?
      {
        input: {
          onChange: handleChange,
        },
        ...restProps
      } :
      {
        ...restProps
      };
  }

  return (
    <>
      <Button onClick={handleClearTime}>clear time</Button>
      <div>State time: <span id="state-time">{time}</span></div>
      <div>
        <Timepicker
          value={time}
          onChange={handleChange}
          {...getAdjustedProps(props)}
        />
      </div>
    </>
  );
};
