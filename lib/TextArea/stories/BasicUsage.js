/**
 * TextArea: Basic Usage
 */

import React from 'react';
import TextArea from '../TextArea';

const BasicUsage = () => (
  <div>
    <TextArea
      label="Field with label"
      placeholder="Placeholder Text"
      required
    />
    <TextArea
      value="This field is disabled"
      label="Disabled field"
      disabled
    />
    <TextArea
      validStylesEnabled
      touched
      valid
      dirty
      label="Field with validation success"
    />
    <TextArea
      value="Wrong value.."
      onChange={() => {}}
      touched
      error="Here is an error message"
      label="Field with a validation error"
    />
    <TextArea
      value="Not entirely valid value.."
      onChange={() => {}}
      touched
      warning="Here is a warning"
      dirty
      label="Field with validation warning"
    />
  </div>
);

export default BasicUsage;
