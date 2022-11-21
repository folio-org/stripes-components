/**
 * Timepicker: Basic Usage
 */

import React, { useState } from 'react';
import Timepicker from '../Timepicker';

const BasicUsage = () => {
  const [time, updateTime] = useState(undefined);
  const [inputTime, updateInputTime] = useState(undefined);
  return (
    <div>
      <span>state time: {time}</span>
      <Timepicker
        label="Time"
        value={time}
        onChange={(e) => { updateTime(e.target.value); }}
      />
      <br />
      <span>state time: {inputTime}</span>
      <Timepicker
        label="Raw Input Time"
        value={inputTime}
        useInput
        onChange={(e) => { updateInputTime(e.target.value); }}
      />
      {/* <br />
      <div>Using aria-label:</div>
      <Timepicker
        aria-label="Example Time"
      />
      <br />
      <Timepicker
        label="Time (read only)"
        readOnly
      />
      <br />
      <Timepicker
        label="Time (disabled)"
        disabled
      /> */}
    </div>
  );
};

export default BasicUsage;
