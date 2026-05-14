import React, { useState } from 'react';
import Button from '../../../lib/Button';
import { ConfirmationModal } from '../../../lib/ConfirmationModal';

export default function MiniConfirmationModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button buttonStyle="primary" onClick={() => setOpen(true)}>Open confirmation modal</Button>
      <ConfirmationModal
        open={open}
        heading="Confirm this action"
        message="This change will be applied immediately."
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </>
  );
}
