import React from 'react';

export const AccordionStatusContext = React.createContext();

export const withAccordionStatus = Component => {
  const WrappedComponent = props => (
    <AccordionStatusContext.Consumer>
      {status => (
        <Component
          accordionStatus={status && status.status}
          setStatus={status && status.setStatus}
          onToggle={status && status.onToggle}
          {...props}
        />
      )}
    </AccordionStatusContext.Consumer>
  );
  WrappedComponent.displayName = `Wrapped${Component.displayName ||
    Component.name ||
    'Component'}(withAccordionStatus)`;
  return WrappedComponent;
};
