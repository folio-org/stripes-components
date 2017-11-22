import React from 'react';
import Button from '../Button';

export default () => (
  <div style={{ padding: '0px 20px', maxWidth: '800px' }}>
    <h3>Colors</h3>
    <Button>Primary</Button>
    <Button buttonStyle="secondary">Secondary</Button>
    <Button buttonStyle="error">Error</Button>
    <Button buttonStyle="success">Success</Button>
    <Button buttonStyle="warning">Warning</Button>
    <Button buttonStyle="transparent">Transparent</Button>
    <hr />
    <h3>Hollow</h3>
    <Button hollow>Primary</Button>
    <Button hollow buttonStyle="secondary">Secondary</Button>
    <Button hollow buttonStyle="error">Error</Button>
    <Button hollow buttonStyle="success">Success</Button>
    <Button hollow buttonStyle="warning">Warning</Button>
    <hr />
    <h3>Full width</h3>
    <Button fullWidth>Primary</Button>
    <Button fullWidth buttonStyle="secondary">Secondary</Button>
    <Button fullWidth buttonStyle="error">Error</Button>
  </div>
);
