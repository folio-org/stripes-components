import React, { useState } from 'react';
import TextField from '../../../lib/TextField';

export default function MiniErrorLanguageExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <TextField
        label="Last name *"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="Please fill this in to continue."
      />
    </div>
  );
}
