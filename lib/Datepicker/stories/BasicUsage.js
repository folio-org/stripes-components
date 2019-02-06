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
    <br />
    <Datepicker
      label="Date (required)"
      required
    />
  </div>
);

export default BasicUsage;
