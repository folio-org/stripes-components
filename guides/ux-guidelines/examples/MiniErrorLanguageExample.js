import React, { useState } from 'react';
import TextField from '../../../lib/TextField';

export default function MiniErrorLanguageExample() {
  const [value, setValue] = useState('abc');

  return (
    <div style={{ maxWidth: 320 }}>
      <TextField
        label="Date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="Date must contain YYYY-MM-DD"
      />
    </div>
  );
}
