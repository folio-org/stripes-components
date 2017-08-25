import React from 'react';
import PropTypes from 'prop-types';

import Pane from '../../Pane';

import NotesForm from './NotesForm';
import NoteRenderer from './NoteRenderer';

import css from './Notes.css';

class Notes extends React.Component {
  static propTypes = {
    onToggle: PropTypes.func,
  }

  // eslint-disable-next-line
  handleSubmit(values) {
    // console.log('note submitted!');
  }

  // this is currently passed the item's "key" - may need to be changed in NoteRenderer to something more relevant to the data.
  // eslint-disable-next-line
  handleDelete(id) {
    // console.log('note deleted');
  }

  render() {
    // static scaffolding notes value: array of note objects.
    // replace with dynamic value from wherever(props, GET etc)...
    const notes = [
      {
        text: 'Static note test text verbosity edition. Some people can be quite wordy in their "quick" messages',
        date: '20/01/2014',
        author: {
          name: 'Anna Doe',
          title: 'Librarian',
        },
      },
    ];

    const notesPaneTitle = (
      <div style={{ textAlign: 'center' }}>
        <strong>Notes</strong>
        <div>
          <em>{notes.length} Note{notes.length === 1 ? '' : 's'}</em>
        </div>
      </div>
    );

    const noteList = notes.map((note, i) => (<NoteRenderer note={note} noteKey={i} onDelete={this.handleDelete} key={`noteRender-${i}`} />));

    return (
      <Pane
        defaultWidth="20%"
        paneTitle={notesPaneTitle}
        dismissible
        onClose={this.props.onToggle}
      >
        <div className={css.notesList}>
          {noteList}
        </div>
        <NotesForm form="newNote" onSubmit={this.handleSubmit} />
      </Pane>
    );
  }
}

export default Notes;
