import React, { useRef } from 'react';
import Callout from '../../../lib/Callout';
import Button from '../../../lib/Button';

export default function MiniCalloutExample() {
  const calloutRef = useRef(null);

  return (
    <div>
      <Callout ref={calloutRef} />
      <Button
        buttonStyle="primary"
        onClick={() => {
          calloutRef.current?.sendCallout({
            type: 'success',
            message: 'Record updated',
            timeout: 4000,
          });
        }}
      >
        Trigger callout
      </Button>
    </div>
  );
}
