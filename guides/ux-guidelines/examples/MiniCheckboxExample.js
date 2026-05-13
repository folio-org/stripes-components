import React, { useState } from 'react';
import Checkbox from '../../../lib/Checkbox';

export default function MiniCheckboxExample() {
  const [checked, setChecked] = useState(true);

  return (
    <div>
      <Checkbox
        label="Receive updates"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
    </div>
  );
}
