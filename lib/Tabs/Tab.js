import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { TabsContext } from './TabsContext';

import css from './Tabs.css';

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

export default Tab;
