import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import TextField from '../TextField';
import css from './EditableList.css';

const ItemEdit = ({
  rowIndex,
  error,
  field,
  visibleFields,
  columnMapping,
  fieldComponents,
  readOnlyFields,
  widths,
  cells,
  autoFocus
}) => {
  const fields = visibleFields.map((name, fieldIndex) => {
    if (readOnlyFields.indexOf(name) === -1) {
      let mappedName = name;
      if (Object.hasOwnProperty.call(columnMapping, name)) {
        mappedName = columnMapping[name];
      }

      const fieldName = `${field}[${rowIndex}].${name}`;
      const ariaLabel = `${mappedName} ${rowIndex}`;
      const fieldKey = `${field}-${name}-${rowIndex}`;
      const fieldStyle = { flex: `0 0 ${widths[name]}`, width: `${widths[name]}`, padding: '6px' };
      const fieldProps = {
        'name': fieldName,
        'aria-label': ariaLabel,
      };

      if (Object.hasOwnProperty.call(fieldComponents, name)) {
        return (
          <div key={fieldKey} style={fieldStyle}>
            { fieldComponents[name]({ fieldProps, fieldIndex, name, field, rowIndex }) }
          </div>
        );
      }
      return (
        <div key={fieldKey} style={fieldStyle}>
          <Field
            {...fieldProps}
            component={TextField}
            marginBottom0
            fullWidth
            placeholder={name}
            autoFocus={autoFocus && fieldIndex === 0}
          />
        </div>
      );
    }
    return cells[fieldIndex];
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
  autoFocus: PropTypes.bool,
  cells: PropTypes.arrayOf(PropTypes.object),
  columnMapping: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  field: PropTypes.string,
  fieldComponents: PropTypes.object,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  rowIndex: PropTypes.number,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  widths: PropTypes.object,
};

export default ItemEdit;
