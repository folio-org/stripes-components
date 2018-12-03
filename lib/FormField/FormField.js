import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const formField = (WrappedComponent, config) => {
  function fieldWithRef({ input, meta, ...rest }, ref) {
    if (input || meta) {
      return (
        <WrappedComponent
          ref={ref}
          {...input}
          {...config({ input, meta })}
          {...rest}
        />
      );
    } else {
      return (
        <WrappedComponent
          ref={ref}
          {...rest}
        />
      );
    }
  }

  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  fieldWithRef.displayName = `FormField(${componentName})`;

  return forwardRef(fieldWithRef);
};

formField.propTypes = {
  config: PropTypes.func,
  WrappedComponent: PropTypes.element.isRequired,
};

export default formField;
