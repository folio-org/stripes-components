import _ from 'lodash';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import stripesForm from '@folio/stripes-form';
import { Field, FieldArray, reduxForm } from 'redux-form';

import Button from '../../Button';
import List from '../../List';
import ItemEdit from './ItemEdit';
import ItemView from './ItemView';
import EditableListForm from './EditableListForm';

const propTypes = {
  /**
   * The text for the H3 tag in the header of the component
   */
  label: React.PropTypes.string,
  /**
   * Label for the 'Add' button
   */
  createButtonLabel: React.PropTypes.string,
  /**
   * Array of objects to be rendered as list items.
   */
  contentData: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  /**
   * Callback for saving editted list items.
   */
  onUpdate: React.PropTypes.func,
  /**
   * Callback for creating new list items.
   */
  onCreate: React.PropTypes.func,
  /**
   * Callback for list item deletion.
   */
  onDelete: React.PropTypes.func,
  /**
   * Array of fields to render. These will also be editable.
   */
  visibleFields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  /**
   * Object that reflects the shape of list item objects. values should be strings
   * indicating the type: {name:'string'}
   * This is used to create new items.
   */
  itemTemplate: React.PropTypes.object.isRequired,
  /**
   * Fieldname that includes the unique identifier for the list.
   */
  uniqueField: React.PropTypes.string.isRequired,
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return booleans based on object
   * properties" { delete: (item) => {return (!item.item.inUse)} }
   */
  actionSuppression: React.PropTypes.object,
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return booleans based on object
   * properties" { delete: (item) => {return (!item.item.inUse)} }
   */
  // validationFeedback: React.PropTypes.shape(
  //   {
  //     type: React.PropTypes.string,
  //     message: React.PropTypes.string,
  //   }),
   /**
   * Message to display for an empty list.
   */
  isEmptyMessage: React.PropTypes.string,
  /**
   * The key that uniquely names listed objects: defaults to 'name'.
   */
  nameKey: React.PropTypes.string,
};

const defaultProps = {
  createButtonLabel: '+ Add Item',
  uniqueField: 'id',
  nameKey: 'name',
  actionSuppression: { delete: () => false, edit: () => false }
};

class EditableList extends React.Component {
  render() {
    const { contentData } = this.props;
    return (
      <EditableListForm initialValues={{ items: contentData }} {...this.props} />
    )
  }
}

EditableList.propTypes = propTypes;
EditableList.defaultProps = defaultProps;

export default EditableList;
