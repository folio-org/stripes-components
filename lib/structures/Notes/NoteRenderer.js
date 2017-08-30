import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap'; // eslint-disable-line
import { Row, Col } from '../../LayoutGrid';
import Icon from '../../Icon';
import Button from '../../Button';
import DropdownMenu from '../../DropdownMenu';
import NotesForm from './NotesForm';
import css from './Notes.css';

class NoteRenderer extends React.Component {
  static propTypes = {
    stripes: PropTypes.object,
    note: PropTypes.object,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
    noteKey: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      dropDownOpen: false,
      editMode: false,
    };

    this.onToggleDropDown = this.onToggleDropDown.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleFormCancel = this.handleFormCancel.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  onToggleDropDown() {
    this.setState((curState) => {
      const toggled = !curState.dropDownOpen;
      return { dropDownOpen: toggled };
    });
  }

  handleClickEdit() {
    this.setState({ editMode: true });
  }

  handleFormCancel() {
    this.setState({
      editMode: false,
      dropDownOpen: false,
    });
  }

  handleFormSubmit(data) {
    this.props.onUpdate(data);
    this.setState({
      editMode: false,
      dropDownOpen: false,
    });
  }

  handleClickDelete(data) {
    this.props.onDelete(data);
    this.setState({
      editMode: false,
      dropDownOpen: false,
    });
  }

  render() {
    const { note, noteKey, stripes } = this.props;

    const stamp = new Date(Date.parse(note.metaData.createdDate)).toLocaleString(stripes.locale);

    if (this.state.editMode) {
      return (
        <div key={`notes-${noteKey}`} className={`${css.noteWell} ${css.editing}`}>
          <Row middle="xs">
            <Col xs={10}>
              <div className={css.byLine}>{stamp}</div>
              <div className={css.byLine}>{note.metaData.createdByUserId}</div>
            </Col>
          </Row>
          <NotesForm form={`noteEdit-${noteKey}`} initialValues={note} textRows="4" editMode onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />
        </div>
      );
    }

    return (
      <div key={`notes-${noteKey}`} className={css.noteWell}>
        <Row middle="xs">
          <Col xs={10}>
            <div className={css.byLine}>{stamp}</div>
            <div className={css.byLine}>{note.metaData.createdByUserId}</div>
          </Col>
          <Col xs={2}>
            <Dropdown
              id={`edit-delete-dropdown-${noteKey}`}
              style={{ float: 'right' }}
              pullRight
              open={this.state.dropDownOpen}
              onToggle={this.onToggleDropDown}
            >
              <Button buttonStyle="transparent slim" title="Edit or delete this note" bsRole="toggle" >
                <Icon icon="down-caret" color="rgba(150, 150, 150, .5)" />
              </Button>
              <DropdownMenu
                bsRole="menu"
                width="5em"
                minWidth="5em"
                aria-label="Edit or delete this note"
                onToggle={this.onToggleDropDown}
              >
                <Button buttonStyle="marginBottom0 hover fullWidth" onClick={this.handleClickEdit}>Edit</Button>
                <Button buttonStyle="marginBottom0 hover fullWidth" onClick={() => { this.handleClickDelete(noteKey); }}>Delete</Button>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col xs={12} >
            {note.text}
          </Col>
        </Row>
      </div>
    );
  }
}
export default NoteRenderer;
