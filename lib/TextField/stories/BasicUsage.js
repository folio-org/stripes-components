/**
 * TextField: Basic Usage
 */

import React from 'react';
import TextField from '../TextField';

const BasicUsage = () => (
  <div style={{ padding: '15px' }}>
    <TextField
      label="Basic Text Field with label"
      placeholder="Placeholder Text"
    />
    <hr />
    <TextField
      value="test"
      input={{ value: '' }}
      meta={{ touched: true, error: 'Here is an error message' }}
      label="Basic Text Field with error"
      placeholder="Placeholder Text"
      validationEnabled
    />
    <hr />
  </div>
);

export default BasicUsage;
