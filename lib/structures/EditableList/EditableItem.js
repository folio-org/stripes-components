import React from 'react';
import PropTypes from 'prop-types';
import ItemView from './ItemView';
import ItemEdit from './ItemEdit';

const EditableItem = props =>
  (props.editing ? <ItemEdit {...props} /> : <ItemView {...props} />);

EditableItem.propTypes = {
  editing: PropTypes.bool,
};

export default EditableItem;
