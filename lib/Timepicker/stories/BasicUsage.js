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
      label="Disabled Time Picker"
      disabled
    />
  </div>
);

export default BasicUsage;
