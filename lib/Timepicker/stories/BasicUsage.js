/**
 * Timepicker: Basic Usage
 */

import React, {useState} from 'react';
import Timepicker from '../Timepicker';

const BasicUsage = () => {
  const [time, updateTime] = useState('3:00 AM');
  const [timeZoned, updateTimeZoned] = useState('3:00 AM');
  const timeZone = 'America/Barbados'
  return (
    <div>
      <div>State time: {time}</div>
      <div>State time(Barbados): {timeZoned}</div>
      <Timepicker
        label="Time"
        onChange={(e) => updateTime(e.target.value)}
        useInput
      />
      <Timepicker
        label="Time (Barbados)"
        onChange={(e) => updateTimeZoned(e.target.value)}
        timeZone={timeZone}
        useInput
      />
      <br />
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
      />
    </div>
  );
}
export default BasicUsage;
