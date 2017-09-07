import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import stripesForm from '@folio/stripes-form';

import Pluggable from '../../Pluggable';
import TextArea from '../..//TextArea';
import Button from '../../Button';


const renderTextArea = props => (
  <Pluggable type="text-editor" {...props}>
    <TextArea {...props} bottomMargin0 />
  </Pluggable>
);

const propTypes = {
  editMode: PropTypes.bool,
  onCancel: PropTypes.func,
  textRows: PropTypes.string,
  form: PropTypes.string,
  handleSubmit: PropTypes.func,
  reset: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  pristine: PropTypes.bool,
};

function NotesForm(props) {
  const {
    form,
    handleSubmit,
    pristine,
    submitting,
    textRows,
    editMode,
    onCancel,
  } = props;

  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      handler(props.values);
    }
  };

  const handleClickSubmit = () => {
    handleSubmit();
    props.reset();
  };

  return (
    <form>
      <Field
        name="text"
        placeholder={'Enter a note.'}
        aria-label="Note Textarea"
        fullWidth
        id="note_textarea"
        component={renderTextArea}
        onKeyDown={(e) => { handleKeyDown(e, handleClickSubmit); }}
        rows={textRows}
      />
      <div style={{ textAlign: 'right' }}>
        {editMode &&
          <Button buttonStyle="hover" onClick={onCancel} title="Cancel Edit">Cancel</Button>
        }
        <Button disabled={pristine || submitting} onClick={handleClickSubmit} title="Post Note">Post</Button>
      </div>
    </form>
  );
}

NotesForm.propTypes = propTypes;

export default stripesForm({
  form: 'NotesForm',
  enableReinitialize: true,
})(NotesForm);
