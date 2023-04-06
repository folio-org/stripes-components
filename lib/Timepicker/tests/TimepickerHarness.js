import React from 'react';
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
    return harnessProps.input ?
      {
        ...harnessProps,
        input: {
          onChange: (e) => {
            harnessProps.input.onChange(e);
            handleChange(e);
          }
        },
      } :
      {
        onChange: handleChange,
        ...harnessProps
      };
  }

  return (
    <>
      <Button onClick={handleClearTime}>clear time</Button>
      <div>State time: <span id="state-time">{time}</span></div>
      <div>
        <Timepicker
          value={time}
          {...getAdjustedProps(props)}
        />
      </div>
    </>
  );
};
