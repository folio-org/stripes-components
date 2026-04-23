import React from 'react';
import IconButton from '../../../lib/IconButton';

export default function MiniIconButtonsExample() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <IconButton icon="search" aria-label="Search" />
      <IconButton icon="edit" aria-label="Edit" />
      <IconButton icon="trash" aria-label="Delete" />
    </div>
  );
}
