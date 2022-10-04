/**
 * Confirmation Modal Example
 */

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import ConfirmationModal from '..';
import Button from '../../Button';

export default () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open confirmation modal</Button>
      <ConfirmationModal
        open={open}
        id="simple-confirmation-modal"
        heading="Please confirm this action"
        message="Here's a detailed message that explains what happens if you confirm this action."
        bodyTag="div"
        onConfirm={() => { action('Confirmed'); setOpen(false); }}
        onCancel={() => { action('Cancelled'); setOpen(false); }}
        cancelLabel="No, I will not confirm"
        confirmLabel="Okay, I will confirm this"
      />
    </>
  );
};
