import React, { useState } from 'react';
import SearchField from '../../../lib/SearchField';

export default function MiniSearchFieldExample() {
  const [value, setValue] = useState('');

  return (
    <div style={{ maxWidth: 360 }}>
      <SearchField
        aria-label="Search records"
        placeholder="Search records..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    </div>
  );
}
