// @ts-nocheck
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
type formFieldArrayProps = {
  config?: (...args: any[]) => any;
  WrappedComponent: React.ReactElement;
};

const formFieldArray = (WrappedComponent: formFieldArrayProps, config) => {
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
          onAdd={onAdd}
          onRemove={onRemove}
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

export default formFieldArray;
