import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form';
import stripesForm from '@folio/stripes-form';
import { connect } from 'react-redux';

import Button from '../../Button';
import TextField from '../../TextField';

function EditableItemForm(props) {
  const { id, initialValues, type } = props;

  const fields = Object.keys(initialValues).map(name => (
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
  ));

  const actions = (
    <Row end="xs" around="xs" bottom="xs">
      <Col xs>
        <Button onClick={e => props.onCancelClick(id, type)}>Cancel</Button>
        <Button onClick={e => props.onSaveClick(id, type)}>Save</Button>
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
  id: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
};

EditableItemForm.defaultProps = {
  type: 'new',
};

const Form = stripesForm({ navigationCheck: true })(EditableItemForm);

function mapStateToProps(state, props) {
  return {
    form: props.formId,
  };
}
// allow for passing form id dynamically
export default connect(mapStateToProps)(props => <Form {...props} />);
