import React, { useMemo, useState } from 'react';
import Button from '../../../lib/Button';
import Modal from '../../../lib/Modal';

export default function MiniModalExample() {
  const [open, setOpen] = useState(false);

  const footer = useMemo(() => (
    <Button buttonStyle="primary" marginBottom0 onClick={() => setOpen(false)}>
      Close
    </Button>
  ), []);

  return (
    <div>
      <Button buttonStyle="primary" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        dismissible
        closeOnBackgroundClick
        label="Example modal"
        size="small"
        onClose={() => setOpen(false)}
        footer={footer}
      >
        This is a short informational modal.
      </Modal>
    </div>
  );
}
