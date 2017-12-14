/**
 * TextField: Basic Usage
 */

import React from 'react';
import TextField from '../TextField';

const BasicUsage = () => (
  <div style={{ padding: '15px' }}>
    <TextField
      label="Field with label"
      placeholder="Placeholder Text"
      required
    />
    <TextField
      input={{ value: 'Wrong value..', onChange: () => {} }}
      meta={{ touched: true, error: 'Here is an error message' }}
      label="Field with a validation error"
    />
    <TextField
      meta={{ touched: true, valid: true, dirty: true, }}
      label="Field with validation success"
    />
    <TextField
      meta={{ touched: true, warning: 'Here is a warning', dirty: true, }}
      label="Field with validation warning"
    />
  </div>
);

export default BasicUsage;
