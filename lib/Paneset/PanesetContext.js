import React from 'react';

export const PanesetContext = React.createContext();

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function withPaneset(WrappedComponent) {
  class WithPaneset extends React.Component {
    render() {
      return (
        <PanesetContext.Consumer>
          {paneset => <WrappedComponent {...this.props} paneset={paneset} /> }
        </PanesetContext.Consumer>
      );
    }
  }
  WithPaneset.displayName = `WithPaneset(${getDisplayName(WrappedComponent)})`;
  return WithPaneset;
}
