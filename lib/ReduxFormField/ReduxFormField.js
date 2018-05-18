import React from 'react';
import PropTypes from 'prop-types';

const reduxFormField = (WrappedComponent, config) => {
  return ({ input, meta, ...props }) => {
    if (input || meta) {
      return (
        <WrappedComponent
          {...config({ input, meta })}
          {...props}
        />
      );
    } else {
      return (
        <WrappedComponent {...props} />
      );
    }
  };
};

reduxFormField.propTypes = {
  WrappedComponent: PropTypes.element.isRequired,
  config: PropTypes.func
};

export default reduxFormField;
