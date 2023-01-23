import React from 'react';
import Timepicker from '../Timepicker';
import Button from '../../Button';

export default ({ initialValue = '', ...props }) => {
  const [time, updateTime] = React.useState(initialValue);

  const handleClearTime = React.useRef(() => { updateTime(''); }).current;

  return (
    <>
      <Button onClick={handleClearTime}>clear time</Button>
      <div>
        <Timepicker
          value={time}
          onChange={(e) => { updateTime(e.target.value); }}
          {...props}
        />
      </div>
    </>
  );
};
