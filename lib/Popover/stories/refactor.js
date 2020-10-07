/**
 * Popover Basic Usage
 */

import React, { useRef, useState } from 'react';
import Popover from '../Popover';
import Headline from '../../Headline';
import Button from '../../Button';

export default () => {
  const anchorRef = useRef(null);
  const popoverRef = useRef(null);
  const [open, setOpen] = useState(false);
  const toggleOutside = () => setOpen(!open);

  return (
    <div style={{ textAlign: 'center' }}>
      <Headline>Default Popover</Headline>
      <Button onClick={toggleOutside}>
        Toggle {open && '(open)'}
      </Button>
      <Popover
        open={open}
        onToggle={toggleOutside}
        ref={popoverRef}
        placement="bottom-end"
        anchorRef={anchorRef}
        // renderTrigger={({ toggle, open }) => (
        //   <Button onClick={toggle}>
        //     Toggle {open && '(open)'}
        //   </Button>
        // )}
      >
        {({ toggle }) => (
          <>
            Lorem ipsum delor sit amet...
            <Button onClick={toggle}>close</Button>
          </>
        )}
      </Popover>
      <br /><br /><br />
      <span ref={anchorRef}>Anchor</span>
  </div>
  )
}
