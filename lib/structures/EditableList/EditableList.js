import React from 'react';
import {Row, Col} from 'react-bootstrap';
import Button from '@folio/stripes-components/lib/Button';
import List from '@folio/stripes-components/lib/List';
import TextField from '@folio/stripes-components/lib/TextField';

const propTypes= {
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
   * Object that reflects the shape of list item objects. values should be strings indicating the type: {name:'string'}
   * This is used to create new items.
   */
  itemTemplate: React.PropTypes.object.isRequired,
  /**
   * Fieldname that includes the unique identifier for the list.
   */
  uniqueField: React.PropTypes.string.isRequired,
  /**
   *
   */
  editingItem: React.PropTypes.string,
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return booleans based on object properties" { delete: (item) => {return (!item.item.inUse)} }
   */
  actionSuppression: React.PropTypes.object,
  /**
   * Object containing properties of list action names: 'delete', 'edit' and
   * values of sentinel functions that return booleans based on object properties" { delete: (item) => {return (!item.item.inUse)} }
   */
  validationFeedback: React.PropTypes.shape(
    {
      type: React.PropTypes.string,
      message: React.PropTypes.string,
    }),
   /**
   * Message to display for an empty list.
   */
  isEmptyMessage: React.PropTypes.string,
};

const defaultProps = {
  createButtonLabel: '+ Add Item',
  actionSuppression: { delete : (item) => true, edit: (item) => true, },
  uniqueField: 'id',
}

class EditableList extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      editingIdentifier: '',
      creating: false,
      creatingArray:[],
      tempItem: {},
      editArray: [],
    };
    
    this.actionSuppression = { delete : (item) => false, edit: (item) => false, };

    this.editingRow = null;
    this.editingItem = '';

    this.creatingRow = null;
    this.creatingItem = '';

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSaveEditClick = this.handleSaveEditClick.bind(this);
    this.handleEditCancelClick = this.handleEditCancelClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleFieldFocus = this.handleFieldFocus.bind(this);
    this.handleCreateFieldChange = this.handleCreateFieldChange.bind(this);
    this.handleCreateFieldFocus = this.handleCreateFieldFocus.bind(this);
    this.handleCreateCancelClick = this.handleCreateCancelClick.bind(this);
    this.handleCreateSave = this.handleCreateSave.bind(this);
  }
    
  componentDidUpdate(prevProps, prevState){
    if (prevState.creating != this.state.creating && this.editingRow !== null) {
      this.editingRow.getElementsByTagName('input')[0].focus();
    }
  }

  componentWillMount(){
    if (this.props.actionSuppression) {
      Object.assign(this.actionSuppression, this.props.actionSuppression);
    }
  }

  // Utility Methods =================================================== //

  getItemIndex(val, array) {
    const uf = this.props.uniqueField;
    const ind = array.findIndex(
      (item) => {
        return item[uf] === val
      }
    )
    return ind;
  }

  shallowCopy(arr) {
    let newArr = new Array(arr.length);
    for ( var i = 0; i < arr.length; i++ ) newArr[i] = arr[i];
    return newArr;
  }

  getFieldStyle(){
    const fieldCount = this.props.visibleFields.length;
    const fieldWidth = 80 / fieldCount;
    const fieldStyle = { width: fieldWidth + '%', padding: '0 6px' };
    return fieldStyle;
  }

  // "Create" Worflow Methods/Handlers ================================= //

  handleAddClick(){
    let newTempObject = {};
    for (var k in this.props.itemTemplate) { newTempObject[k] = '' };
    newTempObject[this.props.uniqueField] = this.state.creatingArray.length.toString();

    let tempArray = this.state.creatingArray;
    tempArray.push(newTempObject);

    this.setState({
      creatingArray: tempArray,
    });
  }

  handleCreateSave(e){
    const { uniqueField } = this.props;

    let savingIndex;
    if (this.state.creatingArray.length === 1) {
      savingIndex = 0;
    } else {
      const id = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
      savingIndex = this.getItemIndex(id, this.state.creatingArray);
    }

    //clean temp id from object...
    let tempArray = this.state.creatingArray;
    tempArray[savingIndex][uniqueField] = '';

    //send row object to the application...
    this.props.onCreate(tempArray[savingIndex]);

    tempArray.splice(savingIndex, 1);

    this.setState({
      creatingArray: tempArray,
    });
    
    this.editingRow = null;
    this.editingItem = '';
  }

  handleCreateFieldChange(e){
    let tempArray = this.state.creatingArray;
    let ind;
    if (tempArray.length === 1) {
      ind = 0;
    } else {
      ind = this.getItemIndex(this.editingItem, this.state.creatingArray);
    }
    tempArray[ind][e.target.name] = e.target.value;
    this.setState({
      creatingArray: tempArray,
    });
  }

  handleCreateFieldFocus(e){
    const id = e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
    this.editingRow = e.target.parentNode.parentNode.parentNode;
    this.createdItem = id;
  }

  handleCreateCancelClick(e){
    const id = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
    const ind = this.getItemIndex(id, this.state.creatingArray);
    let tempArray = this.state.creatingArray;
    ind !== -1 ? tempArray.splice(ind, 1) : null;
    this.setState({
      creatingArray: tempArray,
    });
  }

  CreateItemFormatter = (item) => {
    const { uniqueField, visibleFields } = this.props;

    const fieldStyle = this.getFieldStyle();
    
    //For each field passed, render data from list item.
    let renderedData = [];
    let editingIndex;
    
    if (this.state.creatingArray.length === 1) {
      editingIndex = 0;
    } else {
      editingIndex = this.getItemIndex(item[uniqueField], this.state.creatingArray);
    }

    visibleFields.forEach(
      (field) => {
        const fieldContent = <TextField
            value={this.state.creatingArray[editingIndex][field]}
            onChange={this.handleCreateFieldChange}
            placeholder={(field === 'desc') ? 'description' : field}
            name={field}
            onFocus={this.handleCreateFieldFocus}
            fullWidth
          />;
        const renderedField = (
          <div key={field || 'e'} style={fieldStyle}>
            {fieldContent}
          </div>
        );
        renderedData.push(renderedField);
      }
    );

    // item actions
    const actions = <div style={{float:'right'}}>
                      <button onClick={this.handleCreateCancelClick}>Cancel</button> 
                      <button onClick={this.handleCreateSave}>Save</button>
                    </div>;

    return (
      <li
        key={`temp-${item[uniqueField]}`}
        data-id={item[uniqueField]}
        style={{ display: 'block', paddingTop: '6px' }}
        ref={item[uniqueField] === this.state.tempItem[uniqueField] ?
          (ref) => {this.editingRow = ref} : null
        }
      >
        <div style={{display: 'flex', justifyContent:'space-between'}}>
          {renderedData}
          <div style={{ width: '20%', padding: '0 6px'}}>{actions}</div>
        </div>
      </li>
    );
  }

  // "Edit" Worflow Methods/Handlers ================================= //

  handleDeleteClick(e) {
    const id = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
    this.props.onDelete(id);
  }

  handleFieldChange(e) {
    let tempArray = this.state.editArray;
    const ind = tempArray.length === 1 ?
      0 : this.getItemIndex(this.editingItem, this.state.editArray);

    tempArray[ind][e.target.name] = e.target.value;
    this.setState({
      editArray: tempArray,
    });
  }

  handleFieldFocus(e) {
    const id = e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
    this.editingRow = e.target.parentNode.parentNode.parentNode;
    this.editingItem = id;
  }

  handleEditClick(e) {
    const id = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-id');
    const ind = this.props.contentData.findIndex(
      (item) => {
        return item[this.props.uniqueField] === id;
      }
    );
    let editArray = this.state.editArray;
    editArray.push(this.props.contentData[ind]);
    this.setState({
      editArray: editArray,
    });
  }

  handleEditCancelClick(e) {
    let ind;
    if (this.state.editArray.length === 1) {
      ind = 0
    } else {
      const id = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
      const ind = this.getItemIndex(id, this.state.editArray);
    }

    let tempArray = this.state.editArray;
    ind !== -1? tempArray.splice(ind, 1) : null;
    this.setState({
      editArray: tempArray,
    });
  }

  handleSaveEditClick(e){
    let savingIndex;
    if (this.state.editArray.length >= 1) {
      savingIndex = 0;
    } else {
      const id = e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
      this.getItemIndex(id, this.state.editArray);
    }

    // Send object to application layer
    this.props.onUpdate(this.state.editArray[savingIndex]);

    let tempArray = this.state.editArray;
    tempArray.splice(savingIndex, 1);

    this.setState({
      creating: false,
      editingIdentifier: null,
      editArray: tempArray,
    });
    this.editingRow = null;
    this.editingItem = '';
  }

  EditItemFormatter = (item) => {
    const { uniqueField, visibleFields } = this.props;
    //For each field passed, render data from list item.

    const fieldStyle = this.getFieldStyle();

    let renderedData = [];
    const editingIndex = this.getItemIndex(item[uniqueField], this.state.editArray);
    const isEditing = editingIndex !== -1;
    visibleFields.forEach(
      (field) => {
        if (field !== uniqueField) {
          let fieldContent;
          /* if state.editingIndentifier matches the user-specified unique field, the row is in 'edit mode' so it renders textfields
             instead of textual data.*/
          if (isEditing/*this.state.editingIdentifier === item[uniqueField]*/) {
            fieldContent = <TextField
              value={this.state.editArray[editingIndex][field]}
              onChange={this.handleFieldChange}
              placeholder={field}
              name={field}
              onFocus={this.handleFieldFocus}
              fullWidth
              marginBottom0
            />;
          } else {
            fieldContent = item[field];
          }
          const renderedField = (
            <div key={field || 'e'} style={fieldStyle}>
              {fieldContent}
            </div>
          );
          renderedData.push(renderedField);
        }
      }
    );

    // If the row is in edit mode, the inputs will be different...
    let actions;

    if (isEditing/*this.state.editingIdentifier === item[uniqueField]*/) {
      // edit mode: 'save' button
      actions = <div style={{ float:'right' }}>
                  <button onClick={this.handleEditCancelClick}>Cancel</button> 
                  <button onClick={this.handleSaveEditClick}>Save</button>
                </div>;
    } else {
      // read mode: 'remove' button
      actions = (
        <div style={{ float:'right' }}>
          { !this.actionSuppression.edit(item) &&
            <button onClick={this.handleEditClick} aria-label="Edit Item">Edit</button>
          }
          { this.actionSuppression.delete(item) &&
            <button onClick={this.handleDeleteClick} aria-label="Delete Item">Delete</button>
          }
        </div>);
    }

    return (
      <li
        key={item[uniqueField]}
        data-id={item[uniqueField]}
        style={{ display: 'block', paddingTop: '6px' }}
        ref={item[uniqueField] === this.state.tempItem[uniqueField] ?
          (ref) => {this.editingRow = ref} : null
        }
      >
        <div style={{display: 'flex', justifyContent:'space-between'}}>
          {renderedData}
          <div style={{ width: '25%', padding: '0 6px'}}>{actions}</div>
        </div>
      </li>
    );
  };

  render() {
    const { label, isEmptyMessage, contentData, createButtonLabel } = this.props;

    return (
      <div>
        <Row>
          <Col xs={4}><h3 style={{ marginTop:"0" }}>{label}</h3></Col>
          <Col xs={4}><Button onClick={this.handleAddClick}>{createButtonLabel}</Button></Col>
        </Row>

        <Row>
          <Col xs={12}>
            <List items={this.state.creatingArray} itemFormatter={this.CreateItemFormatter} isEmptyMessage={''} marginBottom0 />
            <List items={_.sortBy(contentData, [(t) => t.name.toLowerCase()] )} itemFormatter={this.EditItemFormatter} isEmptyMessage={isEmptyMessage} />
          </Col>
        </Row>
      </div>
    );
  }
}

EditableList.propTypes = propTypes;
EditableList.defaultProps = defaultProps;

export default EditableList;
