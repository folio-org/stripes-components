import React from 'react';

export const AccordionStatusContext = React.createContext();

export const withAccordionStatus = Component => {
  const WrappedComponent = props => (
    <AccordionStatusContext.Consumer>
      {status => (
        <Component
          accordionStatus={status?.status}
          setStatus={status?.setStatus}
          onToggle={status?.onToggle}
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
