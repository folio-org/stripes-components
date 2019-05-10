import React from 'react';

export const PanesetContext = React.createContext();

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function withPaneset(WrappedComponent) {
  class WithPaneset extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <PanesetContext.Consumer>
          {paneset => <WrappedComponent {...rest} paneset={paneset} ref={forwardedRef} /> }
        </PanesetContext.Consumer>
      );
    }
  }
  WithPaneset.displayName = `WithPaneset(${getDisplayName(WrappedComponent)})`;
  return React.forwardRef((props, ref) => {
    return <WithPaneset {...props} forwardedRef={ref} />;
  });
}
