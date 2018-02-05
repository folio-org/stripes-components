import React from 'react';
import Button from '../Button';

export default () => (
  <div style={{ padding: '0px 20px', maxWidth: '800px' }}>
    <h3>Colors</h3>
    <Button>Default</Button>
    <Button buttonStyle="primary">Primary</Button>
    <Button buttonStyle="danger">Danger</Button>
    <Button buttonStyle="success">Success</Button>
    <Button buttonStyle="warning">Warning</Button>
    <hr />
    <h3>Full width</h3>
    <Button fullWidth>Default</Button>
    <Button fullWidth buttonStyle="primary">Primary</Button>
    <Button fullWidth buttonStyle="danger">Danger</Button>
  </div>
);
