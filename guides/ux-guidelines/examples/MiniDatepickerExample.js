import React, { useState } from 'react';
import Datepicker from '../../../lib/Datepicker';

export default function MiniDatepickerExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <Datepicker
        label="Choose a date"
        value={value}
        onChange={(e, nextValue) => setValue(nextValue || '')}
      />
    </div>
  );
}
