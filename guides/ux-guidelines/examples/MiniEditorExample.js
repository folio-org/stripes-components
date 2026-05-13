import React, { useState } from 'react';
import Editor from '../../../lib/Editor';

export default function MiniEditorExample() {
  const [value, setValue] = useState('<p>Record summary...</p>');

  return (
    <Editor
      label="Description"
      value={value}
      onChange={setValue}
    />
  );
}
