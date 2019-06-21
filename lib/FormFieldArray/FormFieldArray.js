import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const formFieldArray = (WrappedComponent, config) => {
  function fieldArrayWithRef({ fields, meta, onAdd, ...rest }, ref) {
    if (meta !== undefined) {
      return (
        <WrappedComponent
          ref={ref}
          {...config({ fields, meta, onAdd })}
          {...rest}
        />
      );
    } else {
      return (
        <WrappedComponent
          fields={fields}
          onAdd={onAdd}
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
