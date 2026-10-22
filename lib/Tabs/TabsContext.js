import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TabsContext = React.createContext();

const TabsContextProvider = ({ children }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const defaultContext = {
    selectedTabIndex,
    setSelectedTabIndex
  };

  return (
    <TabsContext.Provider value={defaultContext}>
      {children}
    </TabsContext.Provider>
  );
};

TabsContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
};

export {
  TabsContext,
  TabsContextProvider
};
