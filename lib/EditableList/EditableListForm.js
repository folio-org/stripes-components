import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { intlShape } from 'react-intl';
import stripesForm from '@folio/stripes-form';
import { FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';

import injectIntl from '../InjectIntl';
import Headline from '../Headline';
import Button from '../Button';
import EditableItem from './EditableItem';
import MultiColumnList from '../MultiColumnList';
import css from './EditableList.css';
import IconButton from '../IconButton';

const propTypes = {
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return objects to destructure onto the
   * action button props:
   * { delete: (item) => {return { disabled: item.item.inUse } } }
   */
  actionProps: PropTypes.object,
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return booleans based on object
   * properties" { delete: (item) => {return (!item.item.inUse)} }
   */
  actionSuppression: PropTypes.object,
  /**
   * Additional fields that require building.
   */
  additionalFields: PropTypes.object,
  /**
   *  set custom rendered column names
   */
  columnMapping: PropTypes.object,
  /**
   * manually set column widths, if necessary.
   */
  columnWidths: PropTypes.object,
  /**
   * Label for the 'Add' button
   */
  createButtonLabel: PropTypes.string,
  /**
   *  set custom component for editing
   */
  fieldComponents: PropTypes.object,
  /**
   * passed to MultiColumnList, formatter allows control over how the data is rendered in the cells of the grid.
   */
  formatter: PropTypes.object,
  /**
   * id for Add action.
   */
  id: PropTypes.string,
  /**
   * Callback provided by redux-form to set the initialValues to something else.
   */
  initialize: PropTypes.func,
  /**
  * Initial form values
  */
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  /**
   * boolean that indicates if there are validation errors.
   */
  invalid: PropTypes.bool,
  /**
   * Message to display for an empty list.
   */
  isEmptyMessage: PropTypes.string,
  /**
   * Object where each key's value is the default value for that field.
   * { resourceType: 'book' }
   */
  itemTemplate: PropTypes.object,
  /**
   * The text for the H3 tag in the header of the component
   */
  label: PropTypes.string,
  /**
   * Callback for creating new list items.
   */
  onCreate: PropTypes.func,
  /**
   * Callback for list item deletion.
   */
  onDelete: PropTypes.func,
  /**
   * Callback for saving editted list items.
   */
  onUpdate: PropTypes.func,
  /**
   * boolean that shows if the form has been modified.
   */
  pristine: PropTypes.bool,
  /**
   * List of read-only fields
   */
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  /**
   * Callback provided by redux-form to set the field values to their initialValues
   */
  reset: PropTypes.func,
  /**
   * boolean that indicates that the form is being submitted.
   */
  submitting: PropTypes.bool,

  /**
   * Fieldname that includes the unique identifier for the list.
   */
  uniqueField: PropTypes.string,
  /**
   * Array of fields to render. These will also be editable.
   */
  visibleFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const defaultProps = {
  actionProps: {},
  actionSuppression: { delete: () => false, edit: () => false },
  createButtonLabel: '+ Add new',
  fieldComponents: {},
  itemTemplate: {},
  uniqueField: 'id',
};

class EditableListForm extends React.Component { // eslint-disable-line react/no-deprecated
  constructor(props) {
    super(props);

    let status = [];
    if (props.initialValues) {
      status = this.buildStatusArray(props.initialValues.items);
    }

    this.state = {
      status,
      lastAction: {},
    };

    this.RenderItems = this.RenderItems.bind(this);
    this.setError = this.setError.bind(this);
    this.buildStatusArray = this.buildStatusArray.bind(this);
    this.getColumnWidths = this.getColumnWidths.bind(this);
    this.getVisibleColumns = this.getVisibleColumns.bind(this);
    this.getReadOnlyColumns = this.getReadOnlyColumns.bind(this);

    if (this.props.id) {
      this.testingId = this.props.id;
    } else if (this.props.label) {
      this.testingId = this.props.label.replace(/\s/, '').toLowerCase();
    } else {
      this.testingId = uniqueId();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.initialValues, nextProps.initialValues)) {
      this.setState({
        status: this.buildStatusArray(nextProps.initialValues.items),
      });
    }
  }

  buildStatusArray(items) {
    return items.map(() => ({ editing: false, error: false }));
  }

  onAdd(fields) {
    const { itemTemplate } = this.props;
    const item = { ...itemTemplate };
    fields.unshift(item);
    // add field to edit-tracking in edit mode.
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      if (newState.status.length === 0 && fields.length > 0) {
        newState.status = this.buildStatusArray();
      }
      newState.status.unshift({ editing: true, error: false });
      return newState;
    });
  }

  onCancel(fields, index) {
    const { uniqueField } = this.props;
    const item = fields.get(index);

    // if the item has a unique identifier, toggle its edit mode... if not, remove it.
    if (item[uniqueField]) {
      this.toggleEdit(index);
    } else {
      fields.remove(index);
      this.setState((curState) => {
        const newState = cloneDeep(curState);
        newState.status.splice(index, 1);
        return newState;
      });
    }

    // Reset the field values.
    this.props.reset();
  }

  onSave(fields, index) {
    const item = fields.get(index);
    // if item has no id, it's new...
    const callback = (item.id) ?
      this.props.onUpdate :
      this.props.onCreate;
    const res = callback(item);
    Promise.resolve(res).then(
      () => {
        // Set props.initialValues to the currently-saved field values.
        this.props.initialize(fields.getAll());

        this.toggleEdit(index);
      },
      () => this.setError(index, 'Error on saving data'),
    );
  }

  onEdit(index) {
    this.toggleEdit(index);
  }

  onDelete(fields, index) {
    const { uniqueField } = this.props;
    const item = fields.get(index);
    const res = this.props.onDelete(item[uniqueField]);
    Promise.resolve(res).then(
      () => {
        fields.remove(index);
        // remove item from editable tracking...
        this.setState((curState) => {
          const newState = cloneDeep(curState);
          newState.status.splice(index, 1);
          return newState;
        });
      },
      () => this.setError(index, 'Error on removing data'),
    );
  }

  setError(index, errorMsg) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.status[index].error = errorMsg;
      newState.lastAction = new Date().getTime();
      return newState;
    });
  }

  getColumnWidths() {
    if (!this.props.columnWidths) {
      const visibleColumns = this.getVisibleColumns();
      const totalColumns = visibleColumns.length - 1;
      const staticWidth = 80 / totalColumns;
      const widthsObject = {};
      visibleColumns.forEach((f) => {
        if (f !== 'actions') {
          widthsObject[f] = `${staticWidth}%`;
        }
      });
      widthsObject.actions = '20%';
      return widthsObject;
    }
    return this.props.columnWidths;
  }

  getVisibleColumns() {
    return this.props.visibleFields.concat(['actions']);
  }

  getReadOnlyColumns() {
    const actionsArray = ['actions'];
    if (this.props.readOnlyFields) {
      return this.props.readOnlyFields.concat(actionsArray);
    }
    return actionsArray;
  }

  toggleEdit(index) {
    if (this.state.status.length === 0) {
      this.buildStatusArray();
    }
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      if (newState.status.length === 0) {
        newState.status = this.buildStatusArray();
      }
      newState.status[index].editing = !newState.status[index].editing;
      newState.lastAction = new Date().getTime();
      return newState;
    });
  }

  ItemFormatter = ({
    rowIndex,
    rowData,
    cells,
    fields,
    columnWidths,
    rowProps,
  }) => {
    let isEditing;
    let hasError;
    if (this.state.status.length > 0) {
      isEditing = this.state.status[rowIndex].editing;
      hasError = this.state.status[rowIndex].error;
    } else {
      isEditing = false;
      hasError = false;
    }

    return (
      <EditableItem
        editing={isEditing}
        error={hasError}
        key={rowIndex}
        field="items"
        item={rowData}
        rowIndex={rowIndex}
        columnMapping={this.props.columnMapping}
        actionSuppression={this.props.actionSuppression}
        actionProps={this.props.actionProps}
        visibleFields={this.getVisibleColumns()}
        onCancel={() => this.onCancel(fields, rowIndex)}
        onSave={() => this.onSave(fields, rowIndex)}
        onEdit={() => this.onEdit(rowIndex)}
        onDelete={() => this.onDelete(fields, rowIndex)}
        additionalFields={this.props.additionalFields}
        readOnlyFields={this.getReadOnlyColumns()}
        fieldComponents={this.props.fieldComponents}
        widths={columnWidths}
        cells={cells}
        {...rowProps}
      />
    );
  }

  getActions = (fields, item) => {
    const { actionProps, actionSuppression, pristine, submitting, invalid } = this.props;

    if (this.state.status[item.rowIndex].editing) {
      return (
        <div style={{ display: 'flex' }}>
          <Button
            disabled={pristine || submitting || invalid}
            marginBottom0
            id={`clickable-save-${this.testingId}-${item.rowIndex}`}
            title={this.props.intl.formatMessage({ id: 'stripes-components.saveChangesToThisItem' })}
            onClick={() => this.onSave(fields, item.rowIndex)}
            {...(typeof actionProps.save === 'function' ? actionProps.save(item) : {})}
          >
            Save
          </Button>
          <Button
            marginBottom0
            id={`clickable-cancel-${this.testingId}-${item.rowIndex}`}
            title={this.props.intl.formatMessage({ id: 'stripes-components.cancelEditingThisItem' })}
            onClick={() => this.onCancel(fields, item.rowIndex)}
            {...(typeof actionProps.cancel === 'function' ? actionProps.cancel(item) : {})}
          >
            Cancel
          </Button>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex' }}>
        {!actionSuppression.edit(item) &&
          <IconButton
            icon="edit"
            size="small"
            id={`clickable-edit-${this.testingId}-${item.rowIndex}`}
            onClick={() => this.onEdit(item.rowIndex)}
            title={this.props.intl.formatMessage({ id: 'stripes-components.editThisItem' })}
            {...(typeof actionProps.edit === 'function' ? actionProps.edit(item) : {})}
          />
        }
        {!actionSuppression.delete(item) &&
          <IconButton
            icon="trashBin"
            size="small"
            id={`clickable-delete-${this.testingId}-${item.rowIndex}`}
            onClick={() => this.onDelete(fields, item.rowIndex)}
            title={this.props.intl.formatMessage({ id: 'stripes-components.deleteThisItem' })}
            {...(typeof actionProps.delete === 'function' ? actionProps.delete(item) : {})}
          />
        }
      </div>
    );
  };

  RenderItems({ fields }) {
    const cellFormatters = Object.assign({}, this.props.formatter, { actions: item => this.getActions(fields, item) });
    return (
      <div>
        <Row between="xs" className={css.editableListFormHeader}>
          <Col xs>
            <Headline size="medium" margin="none">{this.props.label}</Headline>
          </Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button onClick={() => this.onAdd(fields)} marginBottom0 id={`clickable-add-${this.testingId}`}>
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
              visibleColumns={this.getVisibleColumns()}
              contentData={fields.getAll()}
              rowFormatter={this.ItemFormatter}
              rowProps={{ fields }}
              formatter={cellFormatters}
              columnWidths={this.getColumnWidths()}
              isEmptyMessage={this.props.isEmptyMessage}
              headerRowClass={css.editListHeaders}
              id={`editList-${this.testingId}`}
            />

          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <form>
        <FieldArray name="items" component={this.RenderItems} toUpdate={this.state.lastAction} />
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
  destroyOnUnmount: false,
})(injectIntl(EditableListForm));
