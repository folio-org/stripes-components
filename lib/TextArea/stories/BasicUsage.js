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
    <br /><br />
    <TextArea
      value="This field is disabled"
      label="Disabled field"
      disabled
    />
    <br /><br />
    <TextArea
      validStylesEnabled
      meta={{ touched: true, valid: true, dirty: true }}
      label="Field with validation success"
    />
    <br /><br />
    <TextArea
      input={{ value: 'Wrong value..', onChange: () => {} }}
      meta={{ touched: true, error: 'Here is an error message' }}
      label="Field with a validation error"
    />
    <br /><br />
    <TextArea
      input={{ value: 'Not entirely valid value..', onChange: () => {} }}
      meta={{ touched: true, warning: 'Here is a warning', dirty: true }}
      label="Field with validation warning"
    />
  </div>
);

export default BasicUsage;
