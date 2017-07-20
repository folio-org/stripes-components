import _ from 'lodash';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

import Button from '../../Button';
import List from '../../List';
import EditableItemForm from './EditableItemForm';
import EditableItemRow from './EditableItemRow';

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
};

class EditableList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      newItems: {},
      editItems: {},
    };

    this.actionSuppression = { delete: () => false, edit: () => false };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSaveEditClick = this.handleSaveEditClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveNewClick = this.handleSaveNewClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  componentWillMount() {
    if (this.props.actionSuppression) {
      Object.assign(this.actionSuppression, this.props.actionSuppression);
    }
  }

  getItemId(item) {
    const { uniqueField } = this.props;
    return item[uniqueField];
  }

  // eslint-disable-next-line class-methods-use-this
  getItemsKey(type) {
    return `${type}Items`;
  }

  // eslint-disable-next-line class-methods-use-this
  getInitialValues(item, fields) {
    return fields.reduce((values, field) => {
      values[field] = item[field];
      return values;
    }, {});
  }

  getEditableFields() {
    const { uniqueField, visibleFields } = this.props;
    return visibleFields.filter(field => field !== uniqueField);
  }

  handleAddClick() {
    const newItem = {};
    const id = _.uniqueId();
    Object.assign(newItem, this.props.itemTemplate);

    newItem[this.props.uniqueField] = id;
    this.state.newItems[id] = newItem;
    this.setState({
      newItems: this.state.newItems,
    });
  }

  handleDeleteClick(id) {
    this.props.onDelete(id);
  }

  handleFieldChange(item, action, form) {
    if (!form.id) return;
    const itemsKey = this.getItemsKey(form.type);
    const items = this.state[itemsKey];
    Object.assign(items[form.id], item);
  }

  handleEditClick(id) {
    const index = this.props.contentData
      .findIndex(item => this.getItemId(item) === id);
    const editItems = this.state.editItems;
    editItems[id] = this.props.contentData[index];
    this.setState({ editItems });
  }

  handleCancelClick(id, type) {
    const itemsKey = this.getItemsKey(type);
    const items = this.state[itemsKey];
    this.setState({ [itemsKey]: _.omit(items, id) });
  }

  handleSaveNewClick(id) {
    const { uniqueField } = this.props;
    const newItems = this.state.newItems;
    const newItem = _.omit(newItems[id], uniqueField);
    this.props.onCreate(newItem);
    this.setState({
      newItems: _.omit(newItems, id),
    });
  }

  handleSaveEditClick(id) {
    const editItems = this.state.editItems;
    const item = this.state.editItems[id];
    this.props.onUpdate(item);
    this.setState({
      editItems: _.omit(editItems, id),
    });
  }

  CreateItemFormatter = (item) => {
    const id = this.getItemId(item);
    const newItem = this.state.newItems[id];
    const fields = this.getEditableFields();
    const row = (<EditableItemForm
      id={id}
      type="new"
      formId={`form-${id}`}
      initialValues={this.getInitialValues(newItem, fields)}
      onChange={this.handleFieldChange}
      onCancelClick={this.handleCancelClick}
      onSaveClick={this.handleSaveNewClick}
    />);

    return (
      <li
        key={`temp-${id}`}
        style={{ display: 'block', paddingTop: '6px' }}
      >
        {row}
      </li>
    );
  }

  EditItemFormatter = (item) => {
    const id = this.getItemId(item);
    const editItem = this.state.editItems[id];
    const fields = this.getEditableFields();
    const row = (editItem) ?
      (<EditableItemForm
        id={id}
        type="edit"
        formId={`form-${id}`}
        initialValues={this.getInitialValues(editItem, fields)}
        onChange={this.handleFieldChange}
        onCancelClick={this.handleCancelClick}
        onSaveClick={this.handleSaveEditClick}
      />) :
      (<EditableItemRow
        id={id}
        actionSuppression={this.actionSuppression}
        fields={fields}
        item={item}
        onEditClick={this.handleEditClick}
        onDeleteClick={this.handleDeleteClick}
      />);

    return (
      <li
        key={id}
        data-id={id}
        style={{ display: 'block', paddingTop: '6px' }}
      >
        {row}
      </li>
    );
  };

  render() {
    const { label, isEmptyMessage, contentData, createButtonLabel } = this.props;
    const nameKey = this.props.nameKey || 'name';
    return (
      <div>
        <Row between="xs">
          <Col xs><h3 style={{ marginTop: '0' }}>{label}</h3></Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button onClick={this.handleAddClick}>{createButtonLabel}</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <List
              items={_.values(this.state.newItems)}
              itemFormatter={this.CreateItemFormatter}
              isEmptyMessage={''}
              marginBottom0
            />
            <List
              items={_.sortBy(
                contentData,
                [t => t[nameKey] && t[nameKey].toLowerCase()],
              )}
              itemFormatter={this.EditItemFormatter}
              isEmptyMessage={isEmptyMessage}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

EditableList.propTypes = propTypes;
EditableList.defaultProps = defaultProps;

export default EditableList;
