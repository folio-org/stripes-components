import React from 'react';
import EditableList from '../../EditableList';

export default function (props) {
  console.warn('Warning: EditableList has moved out of the structures directory. Update path to stripes-components/lib/EditableList.');
  return (
    <EditableList {...props} />
  );
}
