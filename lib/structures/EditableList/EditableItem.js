import React from 'react';
import PropTypes from 'prop-types';
import ItemView from './ItemView';
import ItemEdit from './ItemEdit';

const EditableItem = props =>
  (props.item.editable ? <ItemEdit {...props} /> : <ItemView {...props} />);

EditableItem.propTypes = {
  item: PropTypes.shape({
    editable: PropTypes.boolean,
  }).isRequired,
};

export default EditableItem;
