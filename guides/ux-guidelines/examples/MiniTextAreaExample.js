import React, { useState } from 'react';
import TextArea from '../../../lib/TextArea';

export default function MiniTextAreaExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 420 }}>
      <TextArea
        label="Notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a short note"
      />
    </div>
  );
}
