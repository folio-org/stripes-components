import React, { useState } from 'react';
import Button from '../../../lib/Button';
import ErrorModal from '../../../lib/ErrorModal';

export default function MiniErrorModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button buttonStyle="primary" onClick={() => setOpen(true)}>Open modal</Button>
      <ErrorModal
        open={open}
        label="Unable to save record"
        content="Check required fields and try again."
        buttonLabel="Close"
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
