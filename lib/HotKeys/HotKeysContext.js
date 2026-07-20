import React from "react";

const HotKeysContext = React.createContext({
  hotKeyParent: null,
  hotKeyMap: {}
});

export const withHotKeys = Component => {
  const WrappedComponent = props => (
    <HotKeysContext.Consumer>
      {value => <Component HKcontext={value} {...props} />}
    </HotKeysContext.Consumer>
  );

  WrappedComponent.displayName = `HotKeys-${Component.displayName || Component.name || 'Component'}`;
  return WrappedComponent;
};

export const HotKeysProvider = HotKeysContext.Provider;
