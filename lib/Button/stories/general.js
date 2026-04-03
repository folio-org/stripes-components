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
<<<<<<< HEAD
    <Button aria-disabled="true">Aria-Disabled (focusable)</Button>
=======
    <Button aria-disabled="true">Disabled</Button>
>>>>>>> a5bca1db14987ff5461ef1c507543bfe90b3b418
  </div>
);
