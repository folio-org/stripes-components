/**
 * Headline: Basic Usage
 */

import React, { useState } from 'react';
import IconButton from '../IconButton';
import Checkbox from '../../Checkbox';
import Headline from '../../Headline';

const BasicUsage = () => {
  const [disabled, updateDisabled] = useState(false);

  return (
    <div>
      <Checkbox
        onChange={(() => updateDisabled(current => !current))}
        label="Disable all buttons"
      />
      <br />
      <br />
      <Headline margin="small">Size: Medium</Headline>
      <IconButton
        icon="times"
        aria-label="close"
        disabled={disabled}
      />
      <IconButton
        icon="comment"
        badgeCount="9+"
        disabled={disabled}
      />
      <IconButton
        icon="search"
        disabled={disabled}
      />
      <IconButton
        icon="edit"
        disabled={disabled}
      />
      <IconButton
        icon="duplicate"
        disabled={disabled}
      />
      <br />
      <br />
      <br />
      <Headline margin="small">Size: Small</Headline>
      <IconButton
        size="small"
        icon="times"
        disabled={disabled}
      />
      <IconButton
        size="small"
        icon="comment"
        disabled={disabled}
        badgeCount="9+"
      />
      <IconButton
        size="small"
        icon="search"
        disabled={disabled}
      />
      <IconButton
        size="small"
        icon="edit"
        disabled={disabled}
      />
      <IconButton
        size="small"
        icon="duplicate"
        disabled={disabled}
      />
    </div>
  );
};

export default BasicUsage;
