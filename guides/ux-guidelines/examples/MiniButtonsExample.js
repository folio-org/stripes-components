import React from 'react';
import Button from '../../../lib/Button';

export default function MiniButtonsExample() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button buttonStyle="primary">Primary</Button>
      <Button buttonStyle="danger">Delete</Button>
    </div>
  );
}
