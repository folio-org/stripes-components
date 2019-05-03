import React from 'react';
import Editor from '../Editor';
import modules from './EditorModules';
import formats from './EditorFormats';


const BasicUsage = () => (
  <div>
    <Editor
      label="field with custom toolbar"
      placeholder="Placeholder Text"
      modules={modules}
      formats={formats}
    />
    <Editor
      value="This field is read only"
      label="Read only field"
      readOnly
    />
    <Editor
      value="This field is required"
      label="Required field"
      required
    />
    <Editor
      validStylesEnabled
      valid
      dirty
      label="Field with validation success"
    />
    <Editor
      value="Wrong value.."
      error="Here is an error message"
      label="Field with a validation error"
    />
    <Editor
      value="Not entirely valid value.."
      warning="Here is a warning"
      dirty
      label="Field with validation warning"
    />
  </div>
);

export default BasicUsage;
