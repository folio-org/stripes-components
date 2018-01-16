import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form';
import Button from '../../Button';
import TextField from '../../TextField';
import css from './EditableList.css';

const ItemEdit = ({ rowIndex, error, field, visibleFields, readOnlyFields, additionalFields, onCancel, onSave, widths, cells }) => {
  const fields = visibleFields.map((name, i) => {
    if(readOnlyFields.indexOf(name) === -1 ) {
      return (
        <div key={`${field}-${name}-${rowIndex}`} style={{flex: `0 0 ${widths[name]}`, width: `${widths[name]}`, padding: '6px'}}>
          <Field
            name={`${field}[${rowIndex}].${name}`}
            component={TextField}
            fullWidth
            marginBottom0
            placeholder={name}
          />
        </div>
      )
    }
    return cells[i];
  });
  
  // const actions = (
  //   <Row end="xs" around="xs">
  //     <Col xs>
  //       <Button onClick={onCancel} aria-label="Cancel">Cancel</Button>
  //       <Button onClick={onSave} aria-label="Save Item">Save</Button>
  //     </Col>
  //   </Row>
  // );

  // if (additionalFields) {
  //   for (const additionalField of additionalFields) {
  //     fields.push((
  //       <Col key={additionalField.gloss} xs />
  //     ));
  //   }
  // }

  return (
    <div className={css.editListRow}>
      {fields}
    </div>
  );
};

ItemEdit.propTypes = {
  field: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  additionalFields: PropTypes.object,
};

export default ItemEdit;
