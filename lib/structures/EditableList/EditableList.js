import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EditableListForm from './EditableListForm';

const propTypes = {
  /**
   * Array of objects to be rendered as list items.
   */
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * The key that uniquely names listed objects: defaults to 'name'.
   */
  nameKey: PropTypes.string,
  /**
   * Additional fields that require building.
   */
  additionalFields: PropTypes.object,
};

const defaultProps = {
  nameKey: 'name',
};

const EditableList = (props) => {
  const { contentData, nameKey } = props;
  const items = _.sortBy(contentData, [t => t[nameKey] && t[nameKey].toLowerCase()]);
  return (<EditableListForm initialValues={{ items }} {...props} />);
};

EditableList.propTypes = propTypes;
EditableList.defaultProps = defaultProps;

export default EditableList;
