import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const formFieldArray = (WrappedComponent, config) => {
  function fieldArrayWithRef({ fields, meta, onAdd, onRemove, ...rest }, ref) {
    if (meta !== undefined) {
      return (
        <WrappedComponent
          ref={ref}
          {...config({ fields, meta, onAdd, onRemove })}
          {...rest}
        />
      );
    } else {
      return (
        <WrappedComponent
          fields={fields}
          ref={ref}
          {...rest}
        />
      );
    }
  }

  const componentName = WrappedComponent.displayName || WrappedComponent.name;
  fieldArrayWithRef.displayName = `FormFieldArray(${componentName})`;

  return forwardRef(fieldArrayWithRef);
};

formFieldArray.propTypes = {
  config: PropTypes.func,
  WrappedComponent: PropTypes.element.isRequired,
};

export default formFieldArray;
