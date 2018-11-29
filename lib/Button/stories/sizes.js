import React from 'react';
import Button from '../Button';

export default () => (
  <div style={{ maxWidth: '800px' }}>
    <h3>Mega</h3>
    <Button buttonStyle="default mega">Default</Button>
    <Button buttonStyle="primary mega">Primary</Button>
    <Button buttonStyle="danger mega">Danger</Button>
    <Button buttonStyle="success mega">Success</Button>
    <Button buttonStyle="warning mega">Warning</Button>
    <hr />
    <h3>Slim</h3>
    <Button buttonStyle="default slim">Default</Button>
    <Button buttonStyle="primary slim">Primary</Button>
    <Button buttonStyle="danger slim">Danger</Button>
    <Button buttonStyle="success slim">Success</Button>
    <Button buttonStyle="warning slim">Warning</Button>
  </div>
);
