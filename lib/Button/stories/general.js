import React from 'react';
import Button from '../Button';

export default () => (
  <div style={{ padding: '20px' }}>
    <Button>Default</Button>
    <Button buttonStyle="primary">Primary</Button>
    <Button buttonStyle="danger">Danger</Button>
    <Button buttonStyle="success">Success</Button>
    <Button buttonStyle="warning">Warning</Button>
    <Button buttonStyle="link">Link</Button>
  </div>
);
