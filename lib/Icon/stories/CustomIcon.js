/**
 * Icon -> Custom icon example
 */

import React from 'react';
import Icon from '../Icon';

export default () => {
  const icon = props => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.9 2.4v10.4l9.7-5.2zM2.4 29.6l9.7-5.2-9.7-5.2zm17.5 0l9.7-5.2-9.7-5.2z" />
    </svg>
  );

  return <Icon icon={icon} />;
};
