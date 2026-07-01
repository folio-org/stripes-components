import React, { useContext, cloneElement } from 'react';
import PropTypes from 'prop-types';

import { TabsContext } from './TabsContext';

import css from './Tabs.css';

const TabList = (props) => {
  const {
    ariaLabel,
    children
  } = props;

  const {
    selectedTabIndex,
    setSelectedTabIndex
  } = useContext(TabsContext);

  // Add the index to each child, which will allow us to ensure the current
  // tab is styled correctly and has focus etc.
  const childrenArray = Array.isArray(children) ? children : [children];
  const childrenWithIndex = childrenArray.map((child, index) => cloneElement(child, { index, key: index }));

  // Handle setting of the next index when navigating
  // by keyboard
  const calculateNextIndex = (action) => {
    if (action === 'increase') {
      const maxIndex = children.length - 1;
      return selectedTabIndex < maxIndex ?
        selectedTabIndex + 1 :
        selectedTabIndex;
    }
    if (action === 'decrease') {
      return selectedTabIndex > 0 ?
        selectedTabIndex - 1 :
        selectedTabIndex;
    }
    return selectedTabIndex;
  };

  // Handle the right and left cursor keys for navigating
  // via keyboard.
  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 39: // Right arrow
        setSelectedTabIndex(calculateNextIndex('increase'));
        break;
      case 37: // Left arrow
        setSelectedTabIndex(calculateNextIndex('decrease'));
        break;
      default:
    }
  };

  return (
    <ul
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className={css.tabList}
      role="tablist"
    >
      {childrenWithIndex}
    </ul>
  );
};

TabList.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
};

export default TabList;
