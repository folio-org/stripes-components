import React from 'react';
import Dropdown from '../../../lib/Dropdown';
import Button from '../../../lib/Button';
import DropdownMenu from '../../../lib/DropdownMenu';

export default function MiniDropdownExample() {
  return (
    <Dropdown
      label="Actions"
      renderTrigger={({ getTriggerProps }) => (
        <Button buttonStyle="primary" {...getTriggerProps()}>
          Actions
        </Button>
      )}
      renderMenu={({ onToggle }) => (
        <DropdownMenu aria-label="Example actions" onToggle={onToggle}>
          <ul style={{ margin: 0, paddingInlineStart: '1rem' }}>
            <li>View details</li>
            <li>Edit record</li>
            <li>Delete record</li>
          </ul>
        </DropdownMenu>
      )}
    />
  );
}
