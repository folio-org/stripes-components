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
    <br />
    <TextField
      value="This field can't be changed"
      label="Read only field"
      readOnly
    />
    <br />
    <TextField
      value="This field is disabled"
      label="Disabled field"
      disabled
    />
    <br />
    <TextField
      input={{ value: 'Wrong value..', onChange: () => {} }}
      meta={{ touched: true, error: 'Here is an error message' }}
      label="Field with a validation error"
    />
    <br />
    <TextField
      meta={{ touched: true, valid: true, dirty: true, }}
      label="Field with validation success"
    />
    <br />
    <TextField
      input={{ value: 'Not entirely valid value..', onChange: () => {} }}
      meta={{ touched: true, warning: 'Here is a warning', dirty: true, }}
      label="Field with validation warning"
    />
    <br />
    <TextField
      label="Async validating field"
      placeholder="Checkout the spinner!"
      meta={{ asyncValidating: true }}
    />
  </div>
);

export default BasicUsage;
