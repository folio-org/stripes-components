import React, { useState } from 'react';
import Selection from '../../../lib/Selection';

const options = [
  { value: 'open', label: 'Open' },
  { value: 'in-review', label: 'In review' },
  { value: 'closed', label: 'Closed' },
];

export default function MiniSelectionExample() {
  const [value, setValue] = useState('');

  return (
    <Selection
      name="statusSelection"
      id="mini-status-selection"
      label="Status"
      value={value}
      dataOptions={options}
      placeholder="Select status"
      onChange={setValue}
    />
  );
}
