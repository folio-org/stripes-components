/**
 * Confirmation Modal Example
 */

import React from 'react';
import { action } from '@storybook/addon-actions';
import ConfirmationModal from '..';

export default () => (
  <ConfirmationModal
    open
    id="simple-confirmation-modal"
    heading="Please confirm this action"
    message="Here's a detailed message that explains what happens if you confirm this action."
    bodyTag="div"
    onConfirm={action('Confirmed')}
    onCancel={action('Cancelled')}
    cancelLabel="No, I will not confirm"
    confirmLabel="Okay, I will confirm this"
  />
);
