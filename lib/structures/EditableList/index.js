import React from 'react';
import EditableList from '../../EditableList';

export default function (props) {
  console.warn('Warning: EditableList has moved. Update path to stripes-components/lib/EditableList.');
  return (
    <EditableList {...props} />
  );
}
