import React, { createContext } from 'react';

export const { Provider: ResizeProvider, Consumer: ResizeConsumer } = createContext();

export const withResize = (Component) => {
  const WrappedComponent = (props) => (
    <ResizeConsumer>
      { resizer => <Component resizer={resizer} {...props} /> }
    </ResizeConsumer>
  );

  return WrappedComponent;
};
