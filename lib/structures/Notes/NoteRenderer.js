import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'react-bootstrap'; // eslint-disable-line
import { Row, Col } from '../../LayoutGrid';
import Icon from '../../Icon';
import Button from '../../Button';
import DropdownMenu from '../../DropdownMenu';
import NotesForm from './NotesForm';

import css from './Notes.css';

/* This scaffolding of the note renderer
assumes that a note is passed in the shape of
{
  author: {
    name:
    title:
  },
  date: string,
  text: string
}

this may vary from the actual implementation
*/

class NoteRenderer extends React.Component {
  static propTypes = {
    note: PropTypes.object,
    onDelete: PropTypes.func,
    noteKey: PropTypes.number,
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

  render() {
    const { note, noteKey, onDelete } = this.props;

    if (this.state.editMode) {
      return (
        <div key={`notes-${noteKey}`} className={`${css.noteWell} ${css.editing}`}>
          <Row middle="xs">
            <Col xs={10}>
              <div className={css.byLine}>{note.date}</div>
              <div className={css.byLine}>{note.author.name}, {note.author.title} </div>
            </Col>
          </Row>
          <NotesForm form={`noteEdit-${noteKey}`} initialValues={note} textRows="4" editMode onCancel={this.handleFormCancel} />
        </div>
      );
    }

    return (
      <div key={`notes-${noteKey}`} className={css.noteWell}>
        <Row middle="xs">
          <Col xs={10}>
            <div className={css.byLine}>{note.date}</div>
            <div className={css.byLine}>{note.author.name}, {note.author.title} </div>
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
                <Button buttonStyle="marginBottom0 hover fullWidth" onClick={() => { onDelete(noteKey); }}>Delete</Button>
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
