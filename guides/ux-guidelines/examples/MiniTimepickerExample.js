import React, { useState } from 'react';
import Timepicker from '../../../lib/Timepicker';

export default function MiniTimepickerExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <Timepicker
        label="Choose a time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        useInput
      />
    </div>
  );
}
