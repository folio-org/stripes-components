import React from 'react';
import ErrorModal from '../../../lib/ErrorModal';

export default function MiniErrorModalExample() {
  return (
    <ErrorModal
      open
      label="Unable to save record"
      content="Check required fields and try again."
      buttonLabel="Close"
      onClose={() => { }}
    />
  );
}
