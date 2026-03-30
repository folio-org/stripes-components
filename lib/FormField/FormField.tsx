// @ts-nocheck
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
type formFieldProps = {
  config?: (...args: any[]) => any;
  WrappedComponent: React.ReactElement;
};

const formField = (WrappedComponent: formFieldProps, config) => {
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
      return <WrappedComponent ref={ref} {...rest} />;
    }
  }

  const componentName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  fieldWithRef.displayName = `FormField(${componentName})`;

  return forwardRef(fieldWithRef);
};

export default formField;
