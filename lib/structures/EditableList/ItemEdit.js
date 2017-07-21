import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form';
import Button from '../../Button';
import TextField from '../../TextField';

function ItemEdit(props) {
  const { field, visibleFields, key } = props;
  const fields = visibleFields.map(name => (
    <Col key={`${key}-${name}`} xs>
      <Field
        name={`${field}.${name}`}
        component={TextField}
        fullWidth
        marginBottom0
        placeholder={name}
        onChange={props.onChange}
      />
    </Col>
  ));

  const actions = (
    <Row end="xs" around="xs" bottom="xs">
      <Col xs>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button onClick={props.onSave}>Save</Button>
      </Col>
    </Row>
  );

  return (
    <Row key={`edit-${key}`} around="xs">
      {fields}
      <Col xs>{actions}</Col>
    </Row>
  );
}

ItemEdit.propTypes = {
  field: PropTypes.string,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  visibleFields: React.PropTypes.arrayOf(React.PropTypes.string),
};

export default ItemEdit;
