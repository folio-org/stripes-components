/**
 * SRStatus: Basic Usage
 */

import React, { useRef, useCallback } from 'react';
import SRStatus from '../SRStatus';
import Button from '../../Button';

const BasicUsage = () => {
  const ref = useRef();

  const someCallback = useCallback(() => {
    ref.current.sendMessage('message');
  }, []);

  return (
    <div>
      <SRStatus ref={ref} />
      <Button type="button" onClick={someCallback}> Hear Message </Button>
    </div>
  );
};

export default BasicUsage;
