import React from 'react';
import Button from '../Button';

export default () => (
  <div>
    <h3>Small</h3>
    <Button buttonStyle="default" size="small">Default</Button>
    <Button buttonStyle="primary" size="small">Primary</Button>
    <Button buttonStyle="danger" size="small">Danger</Button>
    <Button buttonStyle="success" size="small">Success</Button>
    <Button buttonStyle="warning" size="small">Warning</Button>
    <Button buttonStyle="plain" size="small">Plain</Button>
    <h3>Medium</h3>
    <Button buttonStyle="default">Default</Button>
    <Button buttonStyle="primary">Primary</Button>
    <Button buttonStyle="danger">Danger</Button>
    <Button buttonStyle="success">Success</Button>
    <Button buttonStyle="warning">Warning</Button>
    <Button buttonStyle="plain">Plain</Button>
    <h3>Large</h3>
    <Button buttonStyle="default" size="large">Default</Button>
    <Button buttonStyle="primary" size="large">Primary</Button>
    <Button buttonStyle="danger" size="large">Danger</Button>
    <Button buttonStyle="success" size="large">Success</Button>
    <Button buttonStyle="warning" size="large">Warning</Button>
    <Button buttonStyle="plain" size="large">Plain</Button>


    <h3>Slim Variant</h3>
    <Button buttonStyle="default slim">Default</Button>
    <Button buttonStyle="primary slim">Primary</Button>
    <Button buttonStyle="danger slim">Danger</Button>
    <Button buttonStyle="success slim">Success</Button>
    <Button buttonStyle="warning slim">Warning</Button>
  </div>
);
