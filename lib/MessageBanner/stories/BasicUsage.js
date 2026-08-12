/**
 * MessageBanner -> Basic Usage
 */

import React from 'react';
import MessageBanner from '../MessageBanner';
import TextLink from '../../TextLink';

const BasicUsage = () => (
  <div style={{ maxWidth: 850 }}>
    <MessageBanner>Default <TextLink href="https://www.google.com">Test link</TextLink></MessageBanner>
    <MessageBanner type="success">Success</MessageBanner>
    <MessageBanner type="error">Error</MessageBanner>
    <MessageBanner type="warning">Warning</MessageBanner>
    <MessageBanner type="warning">
      With a lot of content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet, turpis
      a egestas consequat, elit elit fringilla ligula, et luctus magna nunc et mauris. Praesent in felis
      mollis, congue tellus sed, faucibus arcu. Mauris iaculis quam eu elementum interdum. Donec nulla augue,
      scelerisque in scelerisque a, ultrices non arcu. Etiam vehicula convallis erat, ultricies pellentesque
      est commodo vitae. Sed sed est ut odio laoreet lobortis tincidunt vel velit. <TextLink href="https://www.google.com">Test link</TextLink>
    </MessageBanner>
    <MessageBanner type="error">
      <ul>
        <li>
          <strong>Using an unordered HTML list</strong>
        </li>
        <li>Your password must include one numeric value</li>
        <li>Your password must include one special character</li>
        <li>Your password must be at least 8 characters</li>
      </ul>
    </MessageBanner>
  </div>
);

export default BasicUsage;
