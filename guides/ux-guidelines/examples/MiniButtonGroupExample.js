import React from 'react';
import Button from '../../../lib/Button';
import ButtonGroup from '../../../lib/ButtonGroup';

export default function MiniButtonGroupExample() {
  return (
    <ButtonGroup>
      <Button>Summary</Button>
      <Button>Details</Button>
      <Button>History</Button>
    </ButtonGroup>
  );
}
