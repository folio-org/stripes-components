import _ from 'lodash';
import React from 'react';
import stripesForm from '@folio/stripes-form';
import { FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';

import Headline from '../../Headline';
import Button from '../../Button';
import List from '../../List';
import EditableItem from './EditableItem';
import MultiColumnList from '../../MultiColumnList';
import css from './EditableList.css';

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
  additionalFields: PropTypes.object,
  /**
   * List of read-only fields
   */
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  createButtonLabel: '+ Add new',
  uniqueField: 'id',
  actionSuppression: { delete: () => false, edit: () => false },
};

class EditableListForm extends React.Component {
  constructor(props) {
    super(props);

    let status = [];
    if(props.initialValues) {
      status = props.initialValues.items.map((i) => ( {editing: false, error: false} ));
    }

    this.state={
      status,
      lastAction: {},
    };

    this.RenderItems = this.RenderItems.bind(this);
    this.setError = this.setError.bind(this);
    this.buildStatusArray = this.buildStatusArray.bind(this);
    this.getColumnWidths = this.getColumnWidths.bind(this);
    this.getVisibleColumns = this.getVisibleColumns.bind(this);
    this.getReadOnlyColumns = this.getReadOnlyColumns.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.initialValues, nextProps.initialValues)) {
      this.setState({
        status: nextProps.initialValues.items.map((i) => { return {editing: false, error: false} }),
      });
    }
  }

  buildStatusArray(){
    return this.props.initialValues.items.map((i) => { return {editing: false, error: false} });
  }

  onAdd(fields) {
    const { itemTemplate } = this.props;
    const item = {};
    Object.keys(itemTemplate).forEach((key) => { item[key] = ''; });
    fields.unshift(item);
    // add field to edit-tracking in edit mode.
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      if(newState.status.length === 0 && fields.length > 0){
        newState.status = this.buildStatusArray();
      }
      newState.status.unshift({ editing:true, error:false, });
      return newState;
    });
  }

  onCancel(fields, index) {
    const { uniqueField, initialValues } = this.props;
    const item = fields.get(index);

    // if the item has a unique identifier, toggle its edit mode... if not, remove it.
    if (item[uniqueField]) {
      const prevItem = initialValues.items[index];
      this.toggleEdit(index);
    } else {
      fields.remove(index);
      this.setState((curState) => {
        const newState = _.cloneDeep(curState);
        newState.status.splice(index, 1);
        return newState;
      });
    }
  }

  onSave(fields, index) {
    const item = fields.get(index);
    // if item has no id, it's new...
    const callback = (item.id) ?
      this.props.onUpdate :
      this.props.onCreate;
    const res = callback(item);
    const maybePromise = Promise.resolve(res).then(
      v => this.toggleEdit(index),
      err => this.setError(index, 'Error on saving data'),
    );
  }

  onEdit(index) {
    this.toggleEdit(index);
  }

  onDelete(fields, index) {
    const { uniqueField } = this.props;
    const item = fields.get(index);
    const res = this.props.onDelete(item[uniqueField]);
    const maybePromise = Promise.resolve(res).then(
      removed => { 
        fields.remove(index);
        // remove item from editable tracking...
        this.setState((curState) => {
          const newState = _.cloneDeep(curState);
          newState.status.splice(index, 1);
          return newState;
        });
      },
      err => this.setError(index, 'Error on removing data'),
    );
  }

  setError(index, errorMsg) {
    this.setState((curState) => { 
      let newState = _.cloneDeep(curState);
      newState.status[index].error = errorMsg;
      newState.lastAction = new Date().getTime();
      return newState;
    });
  }
  getColumnWidths() {
    if(!this.props.columnWidths) {
      const visibleColumns = this.getVisibleColumns();
      const totalColumns = visibleColumns.length;
      const staticWidth = 100 / totalColumns;
      let widthsObject = {}
      visibleColumns.forEach(f => {
        widthsObject[f] = `${staticWidth}%`;
      });
      return widthsObject;
    }
  }

  getVisibleColumns() {
    return this.props.visibleFields.concat(['actions']);
  }

  getReadOnlyColumns() {
    const actionsArray = ['actions'];
    if(this.props.readOnlyFields){
      return this.props.readOnlyFields.concat(actionsArray);
    }
    return actionsArray;
  }
  
  toggleEdit(index) {
    if(this.state.status.length === 0) {
      this.buildStatusArray();
    }
    this.setState((curState) => { 
      let newState = _.cloneDeep(curState);
      if(newState.status.length === 0){
        newState.status = this.buildStatusArray();
      }
      newState.status[index].editing = !newState.status[index].editing;
      newState.lastAction = new Date().getTime();
      return newState;
    });
  }

  ItemFormatter = ({ 
    rowIndex,
    rowClass,
    rowData,
    cells,
    rowProps,
    width,
    columnWidths,
    columns,
    columnMapping,
    labelStrings,
  },) => {
    let isEditing;
    let hasError;
    if(this.state.status.length > 0) {
      isEditing = this.state.status[rowIndex].editing;
      hasError =  this.state.status[rowIndex].error;
    } else {
      isEditing = false;
      hasError = false;
    }

    return (
      <EditableItem
      editing={isEditing}
      error={hasError}
      key={rowIndex}
      field={"items"}
      item={rowData}
      rowIndex={rowIndex}
      actionSuppression={this.props.actionSuppression}
      visibleFields={this.getVisibleColumns()}
      onCancel={() => this.onCancel(fields, rowIndex)}
      onSave={() => this.onSave(fields, rowIndex)}
      onEdit={() => this.onEdit(rowIndex)}
      onDelete={() => this.onDelete(fields, rowIndex)}
      additionalFields={this.props.additionalFields}
      readOnlyFields = {this.getReadOnlyColumns()}
      widths={columnWidths}
      cells={cells}
      {...rowProps}
    />
    );
    
  }

  getActions = (fields, item) => {
    if(this.state.status[item.rowIndex].editing) {
      return (
        <div>
          <Button marginBottom0 onClick={() => this.onSave(fields, item.rowIndex)}>Save</Button>
          <Button marginBottom0 onClick={() => this.onCancel(fields, item.rowIndex)}>Cancel</Button>
        </div>
      );
    } 
    return (
        <div>
          { !actionSuppression.edit(item) &&
            <Button marginBottom0 onClick={() => this.onEdit(item.rowIndex)}>Edit</Button>
          }
          { !actionSuppression.delete(item) &&
            <Button marginBottom0 onClick={() => this.onDelete(fields,item.rowIndex)}>Delete</Button>
          }
        </div>
    );
  };
    
  RenderItems({ fields }) {
    const cellFormatters = Object.assign({}, this.props.formatter, {'actions': (item) => this.getActions(fields, item), });
    return (
      <div>
        <Row between="xs" className={css.editableListFormHeader}>
          <Col xs>
            <Headline size="medium" margin="none">{this.props.label}</Headline>
          </Col>
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
            <MultiColumnList
              {...this.props}
              visibleColumns = {this.getVisibleColumns()}
              contentData = {fields.getAll()}
              rowFormatter = {this.ItemFormatter}
              rowProps ={{fields}}
              formatter= {cellFormatters}
              columnWidths ={this.getColumnWidths()}
              isEmptyMessage={this.props.isEmptyMessage}
              headerRowClass={css.editListHeaders}
            />

          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <form>
        <FieldArray name="items" component={this.RenderItems} toUpdate={this.state.lastAction}/>
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
