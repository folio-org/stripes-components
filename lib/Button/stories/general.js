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
    <br /><br />
    <h3>Can be used for links:</h3>
    <Button href="www.google.com">Link</Button>
    <p>or</p>
    <Button buttonStyle="link">Link style only</Button>
  </div>
);
