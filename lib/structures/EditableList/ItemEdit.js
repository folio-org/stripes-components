import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form';
import Button from '../../Button';
import TextField from '../../TextField';

const ItemEdit = ({ field, visibleFields, additionalFields, onCancel, onSave }) => {
  const fields = visibleFields.map(name => (
    <Col key={name} xs>
      <Field
        name={`${field}.${name}`}
        component={TextField}
        fullWidth
        marginBottom0
        placeholder={name}
      />
    </Col>
  ));
  const actions = (
    <Row end="xs" around="xs">
      <Col xs>
        <Button onClick={onCancel} aria-label="Cancel">Cancel</Button>
        <Button onClick={onSave} aria-label="Save Item">Save</Button>
      </Col>
    </Row>
  );

  if (additionalFields) {
    for (const additionalField of additionalFields) {
      fields.push((
        <Col key={additionalField.gloss} xs></Col>
      ));
    }
  }

  return (
    <Row around="xs">
      {fields}
      <Col xs>{actions}</Col>
    </Row>
  );
};

ItemEdit.propTypes = {
  field: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  additionalFields: PropTypes.arrayOf(PropTypes.object),
};

export default ItemEdit;
