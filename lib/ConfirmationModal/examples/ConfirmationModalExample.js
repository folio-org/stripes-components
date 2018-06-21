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
    onConfirm={() => alert('Confirmed') /* eslint-disable-line */}
    onCancel={() => alert('Cancelled') /* eslint-disable-line */}
    cancelLabel="No, I will not confirm"
    confirmLabel="Okay, I will confirm this"
  />
);
