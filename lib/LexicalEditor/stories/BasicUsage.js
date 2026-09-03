import React from 'react';
import { LexicalEditor } from '../LexicalEditor';

const BasicUsage = () => {
  return (
    <div>
      <LexicalEditor
        value="<p>This field is read only</p>"
        label="Read only field"
        readOnly
      />
      <LexicalEditor
        value="<p>This field is required</p>"
        label="Required field"
        required
      />
      <LexicalEditor
        validStylesEnabled
        valid
        dirty
        label="Field with validation success"
      />
      <LexicalEditor
        value="<p>Wrong value..</p>"
        error="Here is an error message"
        label="Field with a validation error"
      />
      <LexicalEditor
        value="<p>Not entirely valid value..</p>"
        warning="Here is a warning"
        dirty
        label="Field with validation warning"
      />
    </div>
  );
};

export default BasicUsage;
