import React, { useState } from 'react';
import Select from '../../../lib/Select';

const options = [
  { value: 'books', label: 'Books' },
  { value: 'users', label: 'Users' },
  { value: 'orders', label: 'Orders' },
];

export default function MiniSelectExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 320 }}>
      <Select
        label="Choose a scope"
        dataOptions={options}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
