/**
 * Timepicker: Basic Usage
 */

import React from 'react';
import Timepicker from '../Timepicker';

const BasicUsage = () => (
  <div>
    <Timepicker
      label="Time"
      onChange={e => console.log(e)}
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

export default BasicUsage;
