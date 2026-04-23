import React, { useState } from 'react';
import Dropdown from '../../../lib/Dropdown';
import DropdownButton from '../../../lib/DropdownButton';
import DropdownMenu from '../../../lib/DropdownMenu';

export default function MiniDropdownButtonExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown open={open} onToggle={() => setOpen(prev => !prev)}>
      <DropdownButton data-role="toggle">Actions</DropdownButton>
      <DropdownMenu data-role="menu">
        <span>Choose an action</span>
      </DropdownMenu>
    </Dropdown>
  );
}
