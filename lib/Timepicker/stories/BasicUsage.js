/**
 * Timepicker: Basic Usage
 */

import React from 'react';
import Timepicker from '../Timepicker';

const BasicUsage = () => (
  <div>
    <Timepicker
      label="Time"
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
