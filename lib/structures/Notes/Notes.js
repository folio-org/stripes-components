import React from 'react';
import PropTypes from 'prop-types';
import Pane from '../../Pane';
import NotesForm from './NotesForm';
import NoteRenderer from './NoteRenderer';
import css from './Notes.css';

class Notes extends React.Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired,
    onToggle: PropTypes.func,
    mutator: PropTypes.shape({
      notes: PropTypes.shape({
        POST: PropTypes.func,
        DELETE: PropTypes.func,
        PUT: PropTypes.func,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      notes: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    link: PropTypes.string,
  }

  static manifest = Object.freeze({
    notes: {
      type: 'okapi',
      path: 'notes',
      records: 'notes',
      clear: false,
      GET: {
        params: {
          query: 'link=:{id}',
        },
      },
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      updating: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleSubmit(note) {
    this.setState({ updating: true });
    this.props.mutator.notes.POST(note)
    .then(() => {
      this.setState({ updating: false });
    });
  }

  handleUpdate(note) {
    this.setState({ updating: true });
    this.props.mutator.notes.PUT({
      id: note.id,
      link: note.link,
      text: note.text,
    })
    .then(() => {
      this.setState({ updating: false });
    });
  }

  handleDelete(id) {
    this.setState({ updating: true });
    this.props.mutator.notes.DELETE({ id })
    .then(() => {
      this.setState({ updating: false });
    });
  }

  render() {
    const notes = (this.props.resources.notes || {}).records || [];
    const notesPaneTitle = (
      <div style={{ textAlign: 'center' }}>
        <strong>Notes</strong>
        <div>
          <em>{notes.length} Note{notes.length === 1 ? '' : 's'}</em>
        </div>
      </div>
    );

    const noteList = notes.map((note, i) => (<NoteRenderer stripes={this.props.stripes} note={note} noteKey={note.id} onDelete={this.handleDelete} onUpdate={this.handleUpdate} key={`noteRender-${i}`} />));

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
        <NotesForm
          id="userform-addnote"
          initialValues={{ link: `${this.props.link}/${this.props.match.params.id}` }}
          form="newNote"
          onSubmit={(record) => { this.handleSubmit(record); }}
        />
      </Pane>
    );
  }
}

export default Notes;
