import _ from 'lodash';
import React from 'react';
import stripesForm from '@folio/stripes-form';

import EmbeddedListForm from './EmbeddedListForm';

class EditableListForm extends React.Component {
  render() {
    return (
      <form>
        <EmbeddedListForm {...this.props} />
      </form>
    );
  }
}

export default stripesForm({
  form: 'editableListForm',
  navigationCheck: true,
  enableReinitialize: true,
})(EditableListForm);
