import React from 'react';
import IconButton from '../../../lib/IconButton';
import Tooltip from '../../../lib/Tooltip';

export default function MiniTooltipExample() {
  return (
    <Tooltip id="ux-mini-tooltip" text="Edit record" sub="Shortcut: E">
      {({ ref, ariaIds }) => (
        <IconButton
          icon="edit"
          ref={ref}
          aria-labelledby={ariaIds.text}
          aria-describedby={ariaIds.sub}
        />
      )}
    </Tooltip>
  );
}
