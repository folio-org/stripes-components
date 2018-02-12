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
   * Readonly fields that will not be editable.
   */
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  /**
   * Used to render custom components within the cells of the list.
   */
  formatter: PropTypes.object,
  /**
   * maps column fields to strings that should be rendered in the list headers.
   */
  columnMapping: PropTypes.object,
  /**
   * id for add button
   */
  id: PropTypes.string,
  /**
   * set custom column widths.
   */
  columnWidths: PropTypes.object,
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
