import React from 'react';

import { ResizeContext } from '@folio/stripes-shared-context';

const { Consumer: ResizeConsumer, Provider: ResizeProvider } = ResizeContext;

export const withResize = (Component) => {
  const WrappedComponent = (props) => (
    <ResizeConsumer>
      {resizer => <Component resizer={resizer} {...props} />}
    </ResizeConsumer>
  );

  return WrappedComponent;
};

export { ResizeConsumer, ResizeProvider };
