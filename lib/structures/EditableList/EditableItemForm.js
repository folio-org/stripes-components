import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import TextField from '@folio/stripes-components/lib/TextField';
import { Field } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import { connect } from 'react-redux';

function EditableItemForm(props) {
  const { id, initialValues } = props;
  const fields = Object.keys(initialValues).map(name => {
    return (
      <Col xs key={`${name}-${id}-col`}>
        <Field
          key={`${name}-${id}-name`}
          label={name}
          name={name}
          component={TextField}
          placeholder={name}
          fullWidth
          marginBottom0
          onChange={props.onChange}
        />
      </Col>
    )
  });

  const actions = (
    <Row end="xs" around="xs" bottom="xs">
      <Col xs>
        <Button onClick={e => props.onCancelClick(e, id)}>Cancel</Button>
        <Button onClick={e => props.onSaveClick(e, id)}>Save</Button>
      </Col>
    </Row>
  );

  return (
    <form>
      <Row around="xs">
        {fields}
        <Col xs>{actions}</Col>
      </Row>
    </form>
  );
}

EditableItemForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onChange: PropTypes.func,
};

const Form = stripesForm({
  navigationCheck: true,
})(EditableItemForm);

function mapStateToProps(state, props) {
  return {
    form: props.formId
  };
}

export default connect(mapStateToProps)(props => <Form {...props} />);
