import React, { useRef, useState } from 'react';
import Button from '../../../lib/Button';
import Popper from '../../../lib/Popper';

export default function MiniPopperExample() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  return (
    <div>
      <Button ref={anchorRef} onClick={() => setOpen(prev => !prev)}>
        Toggle help
      </Button>
      <Popper isOpen={open} anchorRef={anchorRef}>
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 12px' }}>
          Overlay content
        </div>
      </Popper>
    </div>
  );
}
