/* eslint-disable no-console */
/**
 * MessageBanner -> Show/hide
 */

import React, { useState } from 'react';
import Button from '../../Button';
import MessageBanner from '../MessageBanner';

const BasicUsage = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ maxWidth: 850 }}>
      <Button onClick={() => setShow(!show)}>Toggle</Button>
      <MessageBanner
        autoFocusDismissButton
        dismissible
        onEnter={() => console.log('Enter')}
        onEntered={() => console.log('Entered')}
        onExit={() => console.log('Exit')}
        onExited={() => setShow(false)}
        show={show}
        type="success"
      >
        Success
      </MessageBanner>
    </div>
  );
};

export default BasicUsage;
