import React from 'react';
import EmptyMessage from '../../EmptyMessage';

export default function (props) {
  console.warn('Warning: EmptyMessage has moved out of the structures directory. Update path to stripes-components/lib/EmptyMessage.');
  return (
    <EmptyMessage {...props} />
  );
}
