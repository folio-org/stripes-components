import React from 'react';
import PropTypes from 'prop-types';
import Pane from '../../Pane';
import IfPermission from '../../IfPermission';
import NotesForm from './NotesForm';
import NoteRenderer from './NoteRenderer';
import css from './Notes.css';

const Notes = (props) => {
  const notes = props.notes;
  const notesPaneTitle = (
    <div style={{ textAlign: 'center' }}>
      <strong>Notes</strong>
      <div>
        <em>{notes.length} Note{notes.length === 1 ? '' : 's'}</em>
      </div>
    </div>
  );

  const noteList = notes.map((note, i) => (<NoteRenderer stripes={props.stripes} note={note} noteKey={note.id} onDelete={props.onDelete} onUpdate={props.onUpdate} key={`noteRender-${i}`} />));

  return (
    <Pane
      defaultWidth="20%"
      paneTitle={notesPaneTitle}
      dismissible
      onClose={props.onToggle}
    >
      <IfPermission perm="notes.collection.get">
        <div className={css.notesList}>
          {noteList}
        </div>
      </IfPermission>
      <IfPermission perm="notes.item.post">
        <NotesForm
          id="userform-addnote"
          initialValues={{ link: props.link }}
          form="newNote"
          onSubmit={props.onSubmit}
        />
      </IfPermission>
    </Pane>
  );
};

Notes.propTypes = {
  stripes: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Notes;
