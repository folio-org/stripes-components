/**
 * Confirmation Modal Example
 */

import React from 'react';
import ConfirmationModal from '@folio/stripes-components/lib/ConfirmationModal'; /* eslint-disable-line import/no-extraneous-dependencies */

export default () => (
  <ConfirmationModal
    open
    id="simple-confirmation-modal"
    heading="Please confirm this action"
    message="Here's a detailed message that explains what happens if you confirm this action."
    onConfirm={() => console.log('Confirmed') /* eslint-disable-line */}
    onCancel={() => console.log('Cancelled') /* eslint-disable-line */}
    cancelLabel="No, I will not confirm"
    confirmLabel="Okay, I will confirm this"
  />
);
