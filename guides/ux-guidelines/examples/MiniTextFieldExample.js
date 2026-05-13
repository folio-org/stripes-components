import React, { useState } from 'react';
import TextField from '../../../lib/TextField';

export default function MiniTextFieldExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <TextField
        label="Record name"
        placeholder="Enter a name"
        value={value}
        required
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
