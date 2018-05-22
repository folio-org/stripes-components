import React from 'react';
import InfoPopover from '../../InfoPopover';

export default function (props) {
  console.warn('Warning: InfoPopover has moved out of the structures directory. Update path to stripes-components/lib/InfoPopover.');
  return (
    <InfoPopover {...props} />
  );
}
