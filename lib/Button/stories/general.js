import React from 'react';
import Button from '../Button';

export default () => (
  <div style={{ padding: '20px' }}>
    <Button>Primary</Button>
    <Button buttonStyle="secondary">Secondary</Button>
    <Button buttonStyle="error">Error</Button>
    <Button buttonStyle="transparent">Transparent</Button>
  </div>
);
