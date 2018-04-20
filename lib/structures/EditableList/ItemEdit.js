import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import TextField from '../../TextField';
import css from './EditableList.css';

const ItemEdit = ({ rowIndex, error, field, visibleFields, readOnlyFields, widths, cells, autoFocus }) => {
  const fields = visibleFields.map((name, i) => {
    if (readOnlyFields.indexOf(name) === -1) {
      return (
        <div key={`${field}-${name}-${rowIndex}`} style={{ flex: `0 0 ${widths[name]}`, width: `${widths[name]}`, padding: '6px' }}>
          <Field
            name={`${field}[${rowIndex}].${name}`}
            component={TextField}
            fullWidth
            marginBottom0
            placeholder={name}
            autoFocus={autoFocus && i === 0}
          />
        </div>
      );
    }
    return cells[i];
  });

  return (
    <div className={css.editListRow}>
      {fields}
      { error &&
        <div className={css.editableListError}>Error: {error}</div>
      }
    </div>
  );
};

ItemEdit.propTypes = {
  field: PropTypes.string,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  rowIndex: PropTypes.number,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  widths: PropTypes.object,
  cells: PropTypes.arrayOf(PropTypes.object),
  autoFocus: PropTypes.bool,
};

export default ItemEdit;
