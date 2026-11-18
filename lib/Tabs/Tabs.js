import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';

import { TabsContextProvider } from './TabsContext';

const Tabs = (props) => {
  const { children } = props;

  const childrenArray = Array.isArray(children) ? children : [children];
  const childIndexes = {};
  const childrenWithIndex = childrenArray.flat().map((child, index) => {
    // children can consist of <TabList> & <TabPanel> components,
    // ensure that the children of different types get correct indexes
    const current = childIndexes[child.type.name];
    childIndexes[child.type.name] = current >= 0 ? current + 1 : 0;
    return cloneElement(
      child,
      {
        index: childIndexes[child.type.name],
        key: index
      }
    );
  });

  return (
    <TabsContextProvider>
      {childrenWithIndex}
    </TabsContextProvider>
  );
};

Tabs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
};

export default Tabs;
