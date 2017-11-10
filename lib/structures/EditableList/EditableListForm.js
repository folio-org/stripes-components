import _ from 'lodash';
import React from 'react';
import stripesForm from '@folio/stripes-form';
import { FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';

import Button from '../../Button';
import List from '../../List';
import EditableItem from './EditableItem';

const propTypes = {
  /**
   * The text for the H3 tag in the header of the component
   */
  label: PropTypes.string,
  /**
   * Label for the 'Add' button
   */
  createButtonLabel: PropTypes.string,
  /**
  * Initial form values
  */
  initialValues: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  /**
   * Callback for saving editted list items.
   */
  onUpdate: PropTypes.func,
  /**
   * Callback for creating new list items.
   */
  onCreate: PropTypes.func,
  /**
   * Callback for list item deletion.
   */
  onDelete: PropTypes.func,
  /**
   * Array of fields to render. These will also be editable.
   */
  visibleFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Object that reflects the shape of list item objects. values should be strings
   * indicating the type: {name:'string'}
   * This is used to create new items.
   */
  itemTemplate: PropTypes.object.isRequired,
  /**
   * Fieldname that includes the unique identifier for the list.
   */
  uniqueField: PropTypes.string.isRequired,
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return booleans based on object
   * properties" { delete: (item) => {return (!item.item.inUse)} }
   */
  actionSuppression: PropTypes.object,
  /**
   * Message to display for an empty list.
   */
  isEmptyMessage: PropTypes.string,
  /**
   * Additional fields that require building.
   */
  additionalFields: PropTypes.array,
};

const defaultProps = {
  createButtonLabel: '+ Add new',
  uniqueField: 'id',
  actionSuppression: { delete: () => false, edit: () => false },
  additionalFields: [],
};

class EditableListForm extends React.Component {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
  }

  onAdd(fields) {
    const { itemTemplate } = this.props;
    const item = { editable: true };
    Object.keys(itemTemplate).forEach((key) => { item[key] = ''; });
    fields.unshift(item);
  }

  onCancel(fields, index) {
    const { uniqueField, initialValues } = this.props;
    const item = fields.get(index);

    if (item[uniqueField]) {
      const prevItem = initialValues.items[index];
      this.toggleEdit(fields, prevItem, index, false);
    } else {
      fields.remove(index);
    }
  }

  onSave(fields, index) {
    const item = fields.get(index);
    const callback = (item.id) ?
      this.props.onUpdate :
      this.props.onCreate;

    this.toggleEdit(fields, item, index, false);
    callback(_.omit(item, 'editable'));
  }

  onEdit(fields, index) {
    const item = fields.get(index);
    this.toggleEdit(fields, item, index, true);
  }

  onDelete(fields, index) {
    const { uniqueField } = this.props;
    const item = fields.get(index);
    fields.remove(index);
    this.props.onDelete(item[uniqueField]);
  }

  // eslint-disable-next-line class-methods-use-this
  toggleEdit(fields, item, index, editable) {
    fields.remove(index);
    item.editable = editable;
    fields.insert(index, item);
  }

  ItemFormatter = (field, index, fields) => (
    <li style={{ display: 'block' }} key={`item-${index}`}>
      <EditableItem
        key={index}
        field={field}
        item={fields.get(index)}
        actionSuppression={this.props.actionSuppression}
        visibleFields={this.props.visibleFields}
        onCancel={() => this.onCancel(fields, index)}
        onSave={() => this.onSave(fields, index)}
        onEdit={() => this.onEdit(fields, index)}
        onDelete={() => this.onDelete(fields, index)}
        additionalFields={this.props.additionalFields}
      />
    </li>
  );

  renderItems({ fields }) {
    return (
      <div>
        <Row between="xs">
          <Col xs><h3 style={{ marginTop: '0' }}>{this.props.label}</h3></Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button onClick={() => this.onAdd(fields)}>
                  {this.props.createButtonLabel}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <List
              items={fields}
              itemFormatter={this.ItemFormatter}
              isEmptyMessage={this.props.isEmptyMessage}
            />
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <form>
        <FieldArray name="items" component={this.renderItems} />
      </form>
    );
  }
}

EditableListForm.propTypes = propTypes;
EditableListForm.defaultProps = defaultProps;

export default stripesForm({
  form: 'editableListForm',
  navigationCheck: true,
  enableReinitialize: true,
})(EditableListForm);
