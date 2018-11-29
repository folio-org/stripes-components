/**
 * Datepicker: Basic Usage
 */

import React from 'react';
import Datepicker from '../Datepicker';

const BasicUsage = () => (
  <div>
    <Datepicker
      label="Date"
    />
    <br />
    <Datepicker
      label="Date (read only)"
      readOnly
    />
    <br />
    <Datepicker
      label="Date (disabled)"
      disabled
    />
  </div>
);

export default BasicUsage;
