import React from 'react';
import RepeatableField from '../../RepeatableField';

export default function (props) {
  console.warn('Warning: RepeatableField has moved out of the structures directory. Update path to stripes-components/lib/RepeatableField.');
  return (
    <RepeatableField {...props} />
  );
}
