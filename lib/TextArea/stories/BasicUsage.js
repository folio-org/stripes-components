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
      hasClearIcon
    />
    <TextArea
      value="This field is disabled"
      label="Disabled field"
      disabled
    />
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <TextArea
        value="This field has a very very very very very very long value"
        label="Field with fit content"
        fitContent
      />
      <TextArea label="Empty field" />
    </div>
    <TextArea
      value="This field is read only"
      label="Read only field"
      readOnly
    />
    <TextArea
      value="This field is required"
      label="Required field"
      required
    />
    <TextArea
      validStylesEnabled
      valid
      dirty
      label="Field with validation success"
    />
    <TextArea
      value="Wrong value.."
      onChange={() => {}}
      error="Here is an error message"
      label="Field with a validation error"
    />
    <TextArea
      value="Not entirely valid value.."
      onChange={() => {}}
      warning="Here is a warning"
      dirty
      label="Field with validation warning"
    />
  </div>
);

export default BasicUsage;
