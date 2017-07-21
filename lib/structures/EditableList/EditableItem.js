import React from 'react';
import PropTypes from 'prop-types';

import ItemView from './ItemView';
import ItemEdit from './ItemEdit';

export default function EditableItem(props) {
  return (props.item.editable) ?
    (<ItemEdit {...props} />) :
    (<ItemView {...props} />);
}

EditableItem.propTypes = {
  item: PropTypes.shape({
    editable: PropTypes.boolean,
  }),
};
