import React from 'react';
import Button from '../Button';

export default () => (
  <div>
    <Button>Default</Button>
    <Button buttonStyle="primary">Primary</Button>
    <Button buttonStyle="danger">Danger</Button>
    <Button buttonStyle="success">Success</Button>
    <Button buttonStyle="warning">Warning</Button>
    <Button disabled>Disabled</Button>
    <Button aria-disabled="true">Disabled</Button>
  </div>
);
