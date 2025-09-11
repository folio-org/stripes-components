/**
 * Confirmation Modal Example
 */

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { useSessionStorage } from 'rehooks-ts'
import { ConfirmationModal, SessionConfirmationModal } from '..';
import Button from '../../Button';
import Checkbox
  from '../../Checkbox';

export default () => {
  const [open, setOpen] = useState(false);
  const [displaySessionModal, setDisplaySessionModal] = useState(false);
  const [suppress, setSuppress] = useSessionStorage('session-modal-example', false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open confirmation modal</Button>
      <div><Checkbox label="session-suppressed modal" onChange={(e) => setDisplaySessionModal(e.target.checked)} /></div>
      {displaySessionModal ? (
        <SessionConfirmationModal
          key={suppress.toString()}
          open={open}
          id="simple-confirmation-modal"
          heading="Please confirm this action"
          message="Here's a detailed message that explains what happens if you confirm this action."
          bodyTag="div"
          onConfirm={() => { action('Confirmed'); setOpen(false); }}
          onCancel={() => { action('Cancelled'); setOpen(false); }}
          cancelLabel="No, I will not confirm"
          confirmLabel="Okay, I will confirm this"
          sessionKey="session-modal-example"
        />
      ) : (
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
      )
      }
    </>
  );
};
