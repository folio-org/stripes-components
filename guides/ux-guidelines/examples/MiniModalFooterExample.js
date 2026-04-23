import React from 'react';
import Button from '../../../lib/Button';
import ModalFooter from '../../../lib/ModalFooter';

export default function MiniModalFooterExample() {
  return (
    <ModalFooter>
      <Button buttonStyle="primary">Save</Button>
      <Button>Cancel</Button>
    </ModalFooter>
  );
}
