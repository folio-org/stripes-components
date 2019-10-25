/**
 * Button -> Basic Usage
 */

import React from 'react';
import MessageBanner from '../MessageBanner';

const BasicUsage = () => (
  <div style={{ maxWidth: 800 }}>
    <MessageBanner>Default</MessageBanner>
    <br />
    <MessageBanner type="success">
      Success
    </MessageBanner>
    <br />
    <MessageBanner type="error">
      Error
    </MessageBanner>
    <br />
    <MessageBanner type="warning">Warning</MessageBanner>
    <br />
    <MessageBanner type="warning">With a lot of content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet, turpis a egestas consequat, elit elit fringilla ligula, et luctus magna nunc et mauris. Praesent in felis mollis, congue tellus sed, faucibus arcu. Mauris iaculis quam eu elementum interdum. Donec nulla augue, scelerisque in scelerisque a, ultrices non arcu. Etiam vehicula convallis erat, ultricies pellentesque est commodo vitae. Sed sed est ut odio laoreet lobortis tincidunt vel velit. </MessageBanner>
    <br />
  </div>
);

export default BasicUsage;
