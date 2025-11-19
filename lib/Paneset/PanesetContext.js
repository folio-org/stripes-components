import React from 'react';

import { PanesetContext } from '@folio/stripes-shared-context';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function withPaneset(WrappedComponent) {
  class WithPaneset extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props; // eslint-disable-line react/prop-types
      return (
        <PanesetContext.Consumer>
          {paneset => <WrappedComponent {...rest} paneset={paneset} ref={forwardedRef} />}
        </PanesetContext.Consumer>
      );
    }
  }
  WithPaneset.displayName = `WithPaneset(${getDisplayName(WrappedComponent)})`;

  return React.forwardRef((props, ref) => { // eslint-disable-line react/no-multi-comp
    return <WithPaneset {...props} forwardedRef={ref} />;
  });
}

export { PanesetContext } from '@folio/stripes-shared-context';
