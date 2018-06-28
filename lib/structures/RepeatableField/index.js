import React from 'react';
import RepeatableField from '../../RepeatableField';

export default function (props) {
  console.warn('Warning: RepeatableField has moved. Update path to stripes-components/lib/RepeatableField.');
  return (
    <RepeatableField {...props} />
  );
}
