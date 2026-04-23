import React from 'react';
import Button from '../../../lib/Button';
import Popover from '../../../lib/Popover';

export default function MiniPopoverExample() {
  return (
    <Popover
      renderTrigger={({ toggle, ref }) => (
        <Button onClick={toggle} buttonRef={ref}>More info</Button>
      )}
    >
      Additional context appears here.
    </Popover>
  );
}
