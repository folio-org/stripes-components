/**
 * TextField: Basic Usage
 */

import React from 'react';
import TextField from '../TextField';
import Icon from '../../Icon';

const BasicUsage = () => (
  <div>
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
      validStylesEnabled
      value="Good value"
      label="Field with validation success"
      touched
      valid
      dirty
    />
    <br />
    <TextField
      label="Field with a validation error"
      value="Wrong value.."
      error="Here is an error message"
      touched
    />
    <br />
    <TextField
      label="Field with validation warning"
      value="Not entirely valid value.."
      warning="Here is a warning"
      touched
    />
    <br />
    <TextField
      label="Loading field"
      placeholder="Check out the spinner!"
      loading
    />
    <br />
    <TextField
      label="Field with startControl and endControl props"
      startControl={<Icon icon="search" />}
      endControl={<Icon icon="trashBin" />}
    />
  </div>
);

export default BasicUsage;
