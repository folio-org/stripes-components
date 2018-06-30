import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const reduxFormField = (WrappedComponent, config) => {
  function fieldWithRef({ input, meta, ...rest }, ref) {
    if (input || meta) {
      return (
        <WrappedComponent
          ref={ref}
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

  const componentName = WrappedComponent.displayName || WrappedComponent.name;
  fieldWithRef.displayName = `ReduxFormField(${componentName})`;

  return forwardRef(fieldWithRef);
};

reduxFormField.propTypes = {
  config: PropTypes.func,
  WrappedComponent: PropTypes.element.isRequired,
};

export default reduxFormField;
