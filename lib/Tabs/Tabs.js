import React, { useContext, cloneElement, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { TabsContext, TabsContextProvider } from './TabsContext';

import css from './Tabs.css';

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

const Tab = (props) => {
  const {
    children,
    index
  } = props;

  const thisTab = useRef(null);

  const {
    selectedTabIndex,
    setSelectedTabIndex
  } = useContext(TabsContext);

  // Ensure the correct tab has focus
  useEffect(() => {
    if (selectedTabIndex === index) {
      thisTab.current.focus();
    }
  // Having index as a dep makes no sense, it's never
  // going to change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabIndex]);

  const activeStyle = selectedTabIndex === index ? css.primary : css.default;
  const finalStyles = [css.tab, activeStyle].join(' ');

  return (
    // Keyboard based interactivity with the tabs is handled in TabList
    // so we don't need a onKey* handler here
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      ref={thisTab}
      tabIndex={selectedTabIndex === index ? 0 : -1}
      onClick={() => setSelectedTabIndex(index)}
      aria-selected={selectedTabIndex === index}
      aria-controls={`tabpanel-${index}`}
      className={finalStyles}
      id={`tab-${index}`}
      role="tab"
    >
      {children}
    </li>
  );
};

Tab.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
    PropTypes.string
  ]),
  index: PropTypes.number
};

const TabPanel = (props) => {
  const {
    children,
    index
  } = props;

  const { selectedTabIndex } = useContext(TabsContext);

  return selectedTabIndex === index && (
    <div
      tabIndex={selectedTabIndex === index ? 0 : -1}
      id={`tabpanel-${index}`}
      className={css.tabPanel}
      role="tabpanel"
    >
      {children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  index: PropTypes.number
};

export {
  TabList,
  Tabs,
  Tab,
  TabPanel
};
